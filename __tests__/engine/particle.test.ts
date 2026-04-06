import {
  createParticle, createPool, activateParticle,
  deactivateParticle, getLifecycleAlpha, findInactiveParticle,
} from '../../src/engine/particle';

describe('Particle pool', () => {
  test('createPool creates correct number of inactive particles', () => {
    const pool = createPool(100);
    expect(pool).toHaveLength(100);
    expect(pool.every((p) => !p.active)).toBe(true);
  });
  test('activateParticle sets all properties', () => {
    const p = createParticle();
    activateParticle(p, 100, 200, 1.5, -2, 5, 220, 70, 80, 3.0);
    expect(p.active).toBe(true);
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
    expect(p.vx).toBe(1.5);
    expect(p.vy).toBe(-2);
    expect(p.hue).toBe(220);
    expect(p.life).toBe(0);
  });
  test('deactivateParticle resets active and alpha', () => {
    const p = createParticle();
    activateParticle(p, 0, 0, 0, 0, 4, 0, 0, 0, 3);
    deactivateParticle(p);
    expect(p.active).toBe(false);
    expect(p.alpha).toBe(0);
  });
  test('findInactiveParticle returns first inactive', () => {
    const pool = createPool(3);
    activateParticle(pool[0], 0, 0, 0, 0, 4, 0, 0, 0, 3);
    const found = findInactiveParticle(pool);
    expect(found).toBe(pool[1]);
  });
  test('findInactiveParticle returns null when all active', () => {
    const pool = createPool(2);
    pool.forEach((p) => activateParticle(p, 0, 0, 0, 0, 4, 0, 0, 0, 3));
    expect(findInactiveParticle(pool)).toBeNull();
  });
});

describe('getLifecycleAlpha', () => {
  test('fade in at start', () => {
    expect(getLifecycleAlpha(0)).toBe(0);
    expect(getLifecycleAlpha(0.05)).toBeCloseTo(0.5);
    expect(getLifecycleAlpha(0.1)).toBeCloseTo(1);
  });
  test('full alpha in middle', () => {
    expect(getLifecycleAlpha(0.5)).toBe(1);
  });
  test('fade out at end', () => {
    expect(getLifecycleAlpha(0.8)).toBeCloseTo(1);
    expect(getLifecycleAlpha(0.9)).toBeCloseTo(0.5);
    expect(getLifecycleAlpha(1.0)).toBeCloseTo(0);
  });
});
