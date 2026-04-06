import { Particle, ParticleParams, TouchPoint } from './types';
import { updateParticle, applySpecialEffect } from './physics';
import { autoEmit, emitParticles } from './emitter';
import { updateDensityGrid } from './density';
import { Theme } from '../themes/types';

interface LoopContext {
  pool: Particle[];
  params: ParticleParams;
  theme: Theme;
  touchPoints: TouchPoint[];
  touchMode: string;
  densityGrid: Float32Array;
  densityCols: number;
  screenWidth: number;
  screenHeight: number;
  lastTime: number;
}

export function stepFrame(ctx: LoopContext, now: number): void {
  'worklet';
  const dt = Math.min((now - ctx.lastTime) / 1000, 0.05);
  ctx.lastTime = now;

  const { pool, params, theme, touchPoints, touchMode, screenWidth, screenHeight } = ctx;

  // 1. Update existing particles
  for (let i = 0; i < pool.length; i++) {
    updateParticle(pool[i], dt, params.gravity, params.viscosity, touchPoints, touchMode, screenWidth);
    applySpecialEffect(pool[i], theme.specialEffect, dt, screenWidth, screenHeight);
  }

  // 2. Emit from touch points
  if (touchMode === 'emit' || touchMode === 'both') {
    const emitCount = Math.ceil(params.count * dt * 0.5);
    for (let i = 0; i < touchPoints.length; i++) {
      if (touchPoints[i].active) {
        emitParticles(pool, touchPoints[i], emitCount, theme.emitPattern,
          theme.hueRange, theme.satRange, theme.lightRange, params.size, params.lifeSpan);
      }
    }
  }

  // 3. Auto-emit to maintain ambient particle count
  let activeCount = 0;
  for (let i = 0; i < pool.length; i++) {
    if (pool[i].active) activeCount++;
  }
  if (activeCount < params.count * 0.8) {
    const deficit = Math.ceil((params.count - activeCount) * dt * 0.3);
    autoEmit(pool, theme.emitPattern, screenWidth, screenHeight,
      theme.hueRange, theme.satRange, theme.lightRange, params.size, params.lifeSpan, deficit);
  }

  // 4. Update density grid
  updateDensityGrid(ctx.densityGrid, ctx.densityCols, pool);
}

export function maybeSpawnShootingStar(
  pool: Particle[], theme: Theme, screenWidth: number, screenHeight: number,
): void {
  'worklet';
  if (theme.specialEffect !== 'shooting-star') return;
  if (Math.random() > 0.002) return;

  const p = pool.find((p) => !p.active);
  if (!p) return;

  const hue = theme.hueRange[0] + Math.random() * (theme.hueRange[1] - theme.hueRange[0]);
  const startY = Math.random() * screenHeight * 0.5;
  const speed = 400 + Math.random() * 300;
  const angle = Math.PI * 0.15 + Math.random() * 0.2;

  p.x = -10; p.y = startY;
  p.vx = Math.cos(angle) * speed;
  p.vy = Math.sin(angle) * speed;
  p.size = 8 + Math.random() * 6;
  p.hue = hue; p.saturation = 50; p.lightness = 95;
  p.alpha = 1; p.life = 0; p.maxLife = 1.5; p.active = true;
}
