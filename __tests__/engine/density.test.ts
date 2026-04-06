import { createDensityGrid, updateDensityGrid, getDensityAt } from '../../src/engine/density';

describe('Density grid', () => {
  test('createDensityGrid sizes correctly', () => {
    const { grid, cols, rows } = createDensityGrid(400, 800);
    expect(cols).toBe(10);
    expect(rows).toBe(20);
    expect(grid.length).toBe(200);
  });
  test('updateDensityGrid counts particles in cells', () => {
    const { grid, cols } = createDensityGrid(400, 400);
    const particles = [
      { x: 5, y: 5, active: true },
      { x: 10, y: 10, active: true },
      { x: 50, y: 50, active: true },
      { x: 5, y: 5, active: false },
    ];
    updateDensityGrid(grid, cols, particles);
    expect(getDensityAt(grid, cols, 5, 5)).toBe(2);
    expect(getDensityAt(grid, cols, 50, 50)).toBe(1);
    expect(getDensityAt(grid, cols, 200, 200)).toBe(0);
  });
  test('getDensityAt returns 0 for out of bounds', () => {
    const { grid, cols } = createDensityGrid(400, 400);
    expect(getDensityAt(grid, cols, -10, -10)).toBe(0);
    expect(getDensityAt(grid, cols, 9999, 9999)).toBe(0);
  });
});
