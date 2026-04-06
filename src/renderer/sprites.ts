import { Skia } from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';

const SPRITE_SIZE = 64;
const HALF = SPRITE_SIZE / 2;

export function createCircleSprite(glowIntensity: number): SkImage {
  const surface = Skia.Surface.Make(SPRITE_SIZE, SPRITE_SIZE)!;
  const canvas = surface.getCanvas();

  if (glowIntensity > 0) {
    const glowPaint = Skia.Paint();
    glowPaint.setColor(Skia.Color('rgba(255,255,255,0.3)'));
    glowPaint.setMaskFilter(
      Skia.MaskFilter.MakeBlur(Skia.BlurStyle.Normal, HALF * glowIntensity * 0.6, true)
    );
    canvas.drawCircle(HALF, HALF, HALF * 0.8, glowPaint);
  }

  const corePaint = Skia.Paint();
  corePaint.setColor(Skia.Color('white'));
  corePaint.setAntiAlias(true);
  canvas.drawCircle(HALF, HALF, HALF * 0.3, corePaint);

  surface.flush();
  return surface.makeImageSnapshot();
}

export function createLineSprite(glowIntensity: number): SkImage {
  const width = 8;
  const height = 24;
  const surface = Skia.Surface.Make(width, height)!;
  const canvas = surface.getCanvas();

  if (glowIntensity > 0) {
    const glowPaint = Skia.Paint();
    glowPaint.setColor(Skia.Color('rgba(255,255,255,0.2)'));
    glowPaint.setMaskFilter(
      Skia.MaskFilter.MakeBlur(Skia.BlurStyle.Normal, 3 * glowIntensity, true)
    );
    canvas.drawRect(Skia.XYWHRect(1, 0, 6, height), glowPaint);
  }

  const corePaint = Skia.Paint();
  corePaint.setColor(Skia.Color('white'));
  corePaint.setAntiAlias(true);
  canvas.drawRect(Skia.XYWHRect(2, 2, 4, height - 4), corePaint);

  surface.flush();
  return surface.makeImageSnapshot();
}

export const CIRCLE_SPRITE_SIZE = SPRITE_SIZE;
export const LINE_SPRITE_WIDTH = 8;
export const LINE_SPRITE_HEIGHT = 24;
