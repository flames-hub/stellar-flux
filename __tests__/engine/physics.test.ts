import { updateParticle } from '../../src/engine/physics';
import { createParticle, activateParticle } from '../../src/engine/particle';
import { TouchPoint } from '../../src/engine/types';

describe('Physics: updateParticle', () => {
  const noTouch: TouchPoint[] = [];
  const dt = 1 / 60;

  test('advances life proportional to dt/maxLife', () => {
    const p = createParticle();
    activateParticle(p, 100, 100, 0, 0, 4, 200, 70, 80, 3.0);
    updateParticle(p, dt, 0, 0, noTouch, 'emit', 400);
    expect(p.life).toBeCloseTo(dt / 3.0);
  });

  test('deactivates particle when life >= 1', () => {
    const p = createParticle();
    activateParticle(p, 100, 100, 0, 0, 4, 200, 70, 80, 0.01);
    updateParticle(p, 1, 0, 0, noTouch, 'emit', 400);
    expect(p.active).toBe(false);
  });

  test('gravity pulls particle downward', () => {
    const p = createParticle();
    activateParticle(p, 100, 100, 0, 0, 4, 200, 70, 80, 5);
    const initialY = p.y;
    for (let i = 0; i < 60; i++) updateParticle(p, dt, 0.5, 0, noTouch, 'emit', 400);
    expect(p.y).toBeGreaterThan(initialY);
  });

  test('negative gravity pulls particle upward', () => {
    const p = createParticle();
    activateParticle(p, 100, 100, 0, 0, 4, 200, 70, 80, 5);
    const initialY = p.y;
    for (let i = 0; i < 60; i++) updateParticle(p, dt, -0.3, 0, noTouch, 'emit', 400);
    expect(p.y).toBeLessThan(initialY);
  });

  test('repulse mode pushes particle away from touch', () => {
    const p = createParticle();
    activateParticle(p, 105, 100, 0, 0, 4, 200, 70, 80, 5);
    const touch: TouchPoint[] = [{ x: 100, y: 100, vx: 0, vy: 0, active: true }];
    updateParticle(p, dt, 0, 0, touch, 'repulse', 400);
    expect(p.vx).toBeGreaterThan(0);
  });

  test('viscosity slows particle', () => {
    const pLow = createParticle();
    const pHigh = createParticle();
    activateParticle(pLow, 100, 100, 10, 0, 4, 200, 70, 80, 5);
    activateParticle(pHigh, 100, 100, 10, 0, 4, 200, 70, 80, 5);
    updateParticle(pLow, dt, 0, 0.0, noTouch, 'emit', 400);
    updateParticle(pHigh, dt, 0, 0.8, noTouch, 'emit', 400);
    expect(Math.abs(pHigh.vx)).toBeLessThan(Math.abs(pLow.vx));
  });

  test('skips inactive particle', () => {
    const p = createParticle();
    updateParticle(p, dt, 0.5, 0, noTouch, 'emit', 400);
    expect(p.y).toBe(0);
  });
});
