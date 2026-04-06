import { Particle } from './types';

export function createParticle(): Particle {
  return {
    x: 0, y: 0, vx: 0, vy: 0, size: 4,
    hue: 0, saturation: 0, lightness: 0,
    alpha: 0, life: 0, maxLife: 3, active: false,
  };
}

export function createPool(maxCount: number): Particle[] {
  return Array.from({ length: maxCount }, () => createParticle());
}

export function activateParticle(
  p: Particle, x: number, y: number, vx: number, vy: number,
  size: number, hue: number, sat: number, light: number, maxLife: number,
): void {
  p.x = x; p.y = y; p.vx = vx; p.vy = vy;
  p.size = size; p.hue = hue; p.saturation = sat; p.lightness = light;
  p.alpha = 0; p.life = 0; p.maxLife = maxLife; p.active = true;
}

export function deactivateParticle(p: Particle): void {
  p.active = false; p.alpha = 0;
}

export function getLifecycleAlpha(life: number): number {
  'worklet';
  if (life < 0.1) return life / 0.1;
  if (life > 0.8) return (1 - life) / 0.2;
  return 1;
}

export function findInactiveParticle(pool: Particle[]): Particle | null {
  for (let i = 0; i < pool.length; i++) {
    if (!pool[i].active) return pool[i];
  }
  return null;
}
