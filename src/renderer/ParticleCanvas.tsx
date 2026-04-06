import React, { useEffect, useMemo, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Skia,
  BlendMode,
  useCanvasRef,
  ImageFilter,
} from '@shopify/react-native-skia';
import type { SkCanvas, SkImage, SkPaint } from '@shopify/react-native-skia';
import { useFrameCallback, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Particle, TouchPoint } from '../engine/types';
import { createPool } from '../engine/particle';
import { createDensityGrid, DENSITY_BLUR_THRESHOLD, DENSITY_CELL_SIZE } from '../engine/density';
import { stepFrame, maybeSpawnShootingStar } from '../engine/loop';
import { applyTrail } from './trail';
import {
  createCircleSprite,
  createLineSprite,
  CIRCLE_SPRITE_SIZE,
  LINE_SPRITE_WIDTH,
  LINE_SPRITE_HEIGHT,
} from './sprites';
import { useParticleStore } from '../store/useParticleStore';
import { themes } from '../themes';

const MAX_POOL_SIZE = 1500;
const MAX_TOUCH_POINTS = 5;

export default function ParticleCanvas() {
  const { width, height } = useWindowDimensions();
  const canvasRef = useCanvasRef();

  // Store selectors
  const activeThemeId = useParticleStore((s) => s.activeThemeId);
  const clusterBlur = useParticleStore((s) => s.clusterBlur);
  const touchMode = useParticleStore((s) => s.touchMode);
  const getEffectiveParams = useParticleStore((s) => s.getEffectiveParams);
  const toggleImmersive = useParticleStore((s) => s.toggleImmersive);

  const theme = themes[activeThemeId] ?? themes.cosmos;

  // Mutable refs — these live outside React's render cycle
  const poolRef = useRef<Particle[]>(createPool(MAX_POOL_SIZE));
  const touchRef = useRef<TouchPoint[]>(
    Array.from({ length: MAX_TOUCH_POINTS }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, active: false,
    })),
  );
  const lastTimeRef = useRef<number>(0);
  const densityRef = useRef<{
    grid: Float32Array; cols: number; rows: number;
  } | null>(null);

  // Re-create density grid when screen size changes
  useEffect(() => {
    densityRef.current = createDensityGrid(width, height);
  }, [width, height]);

  // Sprites — re-create when glow changes
  const params = getEffectiveParams();
  const sprites = useMemo(() => ({
    circle: createCircleSprite(params.glow),
    line: createLineSprite(params.glow),
  }), [params.glow]);

  // Reusable paint for particles
  const particlePaint = useMemo(() => {
    const p = Skia.Paint();
    p.setBlendMode(BlendMode.Screen);
    p.setAntiAlias(true);
    return p;
  }, []);

  // Background gradient paint — update when theme changes
  const bgPaint = useMemo(() => {
    const p = Skia.Paint();
    const shader = Skia.Shader.MakeLinearGradient(
      { x: 0, y: 0 },
      { x: 0, y: height },
      [Skia.Color(theme.background[0]), Skia.Color(theme.background[1])],
      null,
      0, // TileMode.Clamp
    );
    if (shader) p.setShader(shader);
    return p;
  }, [theme.background[0], theme.background[1], height]);

  // Blur filter for cluster blur
  const blurFilter = useMemo(
    () => Skia.ImageFilter.MakeBlur(8, 8, 0, null), // TileMode.Clamp
    [],
  );

  // --- Gestures ---
  const panGesture = Gesture.Pan()
    .maxPointers(MAX_TOUCH_POINTS)
    .onStart((e) => {
      const idx = findFreeTouchSlot(touchRef.current);
      if (idx < 0) return;
      const tp = touchRef.current[idx];
      tp.x = e.x; tp.y = e.y;
      tp.vx = 0; tp.vy = 0;
      tp.active = true;
    })
    .onUpdate((e) => {
      // Use first active slot for single pointer updates
      const tp = touchRef.current.find((t) => t.active) ?? touchRef.current[0];
      tp.vx = e.x - tp.x;
      tp.vy = e.y - tp.y;
      tp.x = e.x;
      tp.y = e.y;
      tp.active = true;
    })
    .onEnd(() => {
      for (let i = 0; i < touchRef.current.length; i++) {
        touchRef.current[i].active = false;
      }
    })
    .onFinalize(() => {
      for (let i = 0; i < touchRef.current.length; i++) {
        touchRef.current[i].active = false;
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(toggleImmersive)();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, doubleTapGesture);

  // --- Frame callback (physics step) ---
  useFrameCallback((info) => {
    const now = info.timestamp;
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = now;
      return;
    }

    const density = densityRef.current;
    if (!density) return;

    const currentParams = getEffectiveParams();
    const currentTheme = themes[useParticleStore.getState().activeThemeId] ?? themes.cosmos;
    const currentTouchMode = useParticleStore.getState().touchMode;
    const currentClusterBlur = useParticleStore.getState().clusterBlur;

    stepFrame(
      {
        pool: poolRef.current,
        params: currentParams,
        theme: currentTheme,
        touchPoints: touchRef.current,
        touchMode: currentTouchMode,
        densityGrid: density.grid,
        densityCols: density.cols,
        screenWidth: width,
        screenHeight: height,
        lastTime: lastTimeRef.current,
      },
      now,
    );
    lastTimeRef.current = now;

    // Occasionally spawn shooting stars
    maybeSpawnShootingStar(poolRef.current, currentTheme, width, height);
  });

  // --- Drawing ---
  const onDraw = (canvas: SkCanvas) => {
    const currentParams = getEffectiveParams();
    const density = densityRef.current;

    // 1. Background
    canvas.drawRect(Skia.XYWHRect(0, 0, width, height), bgPaint);

    // 2. Trail overlay (creates afterimage effect)
    applyTrail(canvas, width, height, currentParams.trail);

    // 3. Draw particles
    const pool = poolRef.current;
    const isLine = theme.particleShape === 'line';
    const sprite = isLine ? sprites.line : sprites.circle;
    const sprW = isLine ? LINE_SPRITE_WIDTH : CIRCLE_SPRITE_SIZE;
    const sprH = isLine ? LINE_SPRITE_HEIGHT : CIRCLE_SPRITE_SIZE;
    const halfW = sprW / 2;
    const halfH = sprH / 2;

    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (!p.active || p.alpha <= 0) continue;

      const scale = p.size / (isLine ? LINE_SPRITE_WIDTH : CIRCLE_SPRITE_SIZE);

      // Per-particle color tint
      particlePaint.setColor(
        Skia.Color(`hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.alpha})`),
      );

      canvas.save();
      canvas.translate(p.x, p.y);
      canvas.scale(scale, scale);
      canvas.translate(-halfW, -halfH);
      canvas.drawImageRect(
        sprite,
        Skia.XYWHRect(0, 0, sprW, sprH),
        Skia.XYWHRect(0, 0, sprW, sprH),
        particlePaint,
      );
      canvas.restore();
    }

    // 4. Cluster blur on dense areas
    if (clusterBlur && density) {
      const { grid, cols, rows } = density;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r * cols + c] >= DENSITY_BLUR_THRESHOLD) {
            const rx = c * DENSITY_CELL_SIZE;
            const ry = r * DENSITY_CELL_SIZE;
            const layerPaint = Skia.Paint();
            layerPaint.setImageFilter(blurFilter);
            canvas.saveLayer(layerPaint);
            canvas.clipRect(Skia.XYWHRect(rx, ry, DENSITY_CELL_SIZE, DENSITY_CELL_SIZE));
            canvas.restore();
          }
        }
      }
    }
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <Canvas ref={canvasRef} style={{ flex: 1 }} onDraw={onDraw} />
    </GestureDetector>
  );
}

function findFreeTouchSlot(points: TouchPoint[]): number {
  for (let i = 0; i < points.length; i++) {
    if (!points[i].active) return i;
  }
  return -1;
}
