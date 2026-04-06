export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  hue: number; saturation: number; lightness: number;
  alpha: number;
  life: number;       // 0..1 (0=just born, 1=dead)
  maxLife: number;     // seconds
  active: boolean;
}

export interface ParticleParams {
  count: number;
  size: number;
  lifeSpan: number;
  glow: number;
  viscosity: number;
  trail: number;
  gravity: number;
}

export type TouchMode = 'emit' | 'repulse' | 'both';

export interface TouchPoint {
  x: number; y: number;
  vx: number; vy: number;
  active: boolean;
}

export interface EngineState {
  particles: Particle[];
  touchPoints: TouchPoint[];
  densityGrid: Float32Array;
  gridCols: number; gridRows: number;
  width: number; height: number;
}
