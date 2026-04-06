import { Skia } from '@shopify/react-native-skia';
import type { SkCanvas, SkPaint } from '@shopify/react-native-skia';

let trailPaint: SkPaint | null = null;

export function applyTrail(canvas: SkCanvas, width: number, height: number, trailLength: number): void {
  const alpha = Math.max(0.05, 1 - trailLength * 0.92);

  if (!trailPaint) {
    trailPaint = Skia.Paint();
  }
  trailPaint.setColor(Skia.Color(`rgba(0,0,0,${alpha})`));

  canvas.drawRect(Skia.XYWHRect(0, 0, width, height), trailPaint);
}
