import { Particle, TouchPoint } from './types';
import { getLifecycleAlpha, deactivateParticle } from './particle';

const FORCE_FIELD_RADIUS_RATIO = 0.08;
const FRICTION = 0.98;

export function updateParticle(
  p: Particle, dt: number, gravity: number, viscosity: number,
  touchPoints: TouchPoint[], touchMode: string, screenWidth: number,
): void {
  'worklet';
  if (!p.active) return;

  p.life += dt / p.maxLife;
  if (p.life >= 1) { deactivateParticle(p); return; }

  p.alpha = getLifecycleAlpha(p.life);
  p.vy += gravity * 100 * dt;

  if (touchMode === 'repulse' || touchMode === 'both') {
    const radius = screenWidth * FORCE_FIELD_RADIUS_RATIO;
    const radiusSq = radius * radius;
    for (let i = 0; i < touchPoints.length; i++) {
      const tp = touchPoints[i];
      if (!tp.active) continue;
      const dx = p.x - tp.x;
      const dy = p.y - tp.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < radiusSq && distSq > 1) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / radius) * 800;
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += (nx * force + tp.vx * 0.3) * dt;
        p.vy += (ny * force + tp.vy * 0.3) * dt;
      }
    }
  }

  const visc = 1 - viscosity * 0.5;
  p.vx *= FRICTION * visc;
  p.vy *= FRICTION * visc;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
}

export function applySpecialEffect(
  p: Particle, effect: string | null, dt: number,
  screenWidth: number, screenHeight: number,
): void {
  'worklet';
  if (!p.active || !effect) return;
  switch (effect) {
    case 'flicker':
      p.lightness += (Math.random() - 0.5) * 20 * dt;
      p.lightness = Math.max(40, Math.min(90, p.lightness));
      break;
    case 'current':
      p.vx += Math.sin(Date.now() * 0.0003) * 15 * dt;
      break;
  }
}
