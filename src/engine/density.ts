const CELL_SIZE = 40;

export function createDensityGrid(width: number, height: number): {
  grid: Float32Array; cols: number; rows: number;
} {
  'worklet';
  const cols = Math.ceil(width / CELL_SIZE);
  const rows = Math.ceil(height / CELL_SIZE);
  return { grid: new Float32Array(cols * rows), cols, rows };
}

export function updateDensityGrid(
  grid: Float32Array, cols: number,
  particles: { x: number; y: number; active: boolean }[],
): void {
  'worklet';
  grid.fill(0);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (!p.active) continue;
    const col = Math.floor(p.x / CELL_SIZE);
    const row = Math.floor(p.y / CELL_SIZE);
    if (col >= 0 && col < cols && row >= 0 && row < (grid.length / cols)) {
      grid[row * cols + col]++;
    }
  }
}

export function getDensityAt(grid: Float32Array, cols: number, x: number, y: number): number {
  'worklet';
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  if (col < 0 || col >= cols || row < 0) return 0;
  const idx = row * cols + col;
  if (idx >= grid.length) return 0;
  return grid[idx];
}

export const DENSITY_BLUR_THRESHOLD = 5;
export const DENSITY_CELL_SIZE = CELL_SIZE;
