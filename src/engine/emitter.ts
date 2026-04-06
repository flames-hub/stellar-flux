import { Particle, TouchPoint } from './types';
import { activateParticle, findInactiveParticle } from './particle';
import { EmitPattern } from '../themes/types';

export function emitParticles(
  pool: Particle[], touch: TouchPoint, count: number, emitPattern: EmitPattern,
  hueRange: [number, number], satRange: [number, number], lightRange: [number, number],
  size: number, maxLife: number,
): void {
  'worklet';
  if (!touch.active) return;
  for (let i = 0; i < count; i++) {
    const p = findInactiveParticle(pool);
    if (!p) return;
    const hue = hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]);
    const sat = satRange[0] + Math.random() * (satRange[1] - satRange[0]);
    const light = lightRange[0] + Math.random() * (lightRange[1] - lightRange[0]);
    let vx: number, vy: number;
    const speed = 50 + Math.random() * 100;
    switch (emitPattern) {
      case 'radial': {
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle) * speed + touch.vx * 0.5;
        vy = Math.sin(angle) * speed + touch.vy * 0.5;
        break;
      }
      case 'upward': {
        const spread = (Math.random() - 0.5) * 1.2;
        vx = Math.sin(spread) * speed * 0.5 + touch.vx * 0.3;
        vy = -speed + touch.vy * 0.3;
        break;
      }
      case 'downward': {
        const spread = (Math.random() - 0.5) * 0.8;
        vx = Math.sin(spread) * speed * 0.3;
        vy = speed * (0.5 + Math.random() * 0.5);
        break;
      }
    }
    const sizeVariance = size * (0.5 + Math.random());
    const lifeVariance = maxLife * (0.7 + Math.random() * 0.6);
    activateParticle(p, touch.x, touch.y, vx, vy, sizeVariance, hue, sat, light, lifeVariance);
  }
}

export function autoEmit(
  pool: Particle[], emitPattern: EmitPattern,
  screenWidth: number, screenHeight: number,
  hueRange: [number, number], satRange: [number, number], lightRange: [number, number],
  size: number, maxLife: number, count: number,
): void {
  'worklet';
  for (let i = 0; i < count; i++) {
    const p = findInactiveParticle(pool);
    if (!p) return;
    const hue = hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]);
    const sat = satRange[0] + Math.random() * (satRange[1] - satRange[0]);
    const light = lightRange[0] + Math.random() * (lightRange[1] - lightRange[0]);
    let x: number, y: number, vx: number, vy: number;
    const speed = 20 + Math.random() * 60;
    switch (emitPattern) {
      case 'radial':
        x = Math.random() * screenWidth; y = Math.random() * screenHeight;
        vx = (Math.random() - 0.5) * speed; vy = (Math.random() - 0.5) * speed;
        break;
      case 'upward':
        x = Math.random() * screenWidth; y = screenHeight + 10;
        vx = (Math.random() - 0.5) * speed * 0.3; vy = -speed;
        break;
      case 'downward':
        x = Math.random() * screenWidth; y = -10;
        vx = (Math.random() - 0.5) * speed * 0.3; vy = speed * (0.3 + Math.random() * 0.7);
        break;
    }
    const sizeVariance = size * (0.5 + Math.random());
    const lifeVariance = maxLife * (0.7 + Math.random() * 0.6);
    activateParticle(p, x, y, vx, vy, sizeVariance, hue, sat, light, lifeVariance);
  }
}
