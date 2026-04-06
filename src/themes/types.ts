export type EmitPattern = 'radial' | 'upward' | 'downward';
export type ParticleShape = 'circle' | 'line';
export type SpecialEffect = 'shooting-star' | 'current' | 'flicker' | null;

export interface ThemePhysics {
  gravity: number;
  viscosity: number;
  defaultCount: number;
  defaultSize: number;
  defaultLifeSpan: number;
  defaultTrail: number;
  defaultGlow: number;
}

export interface Theme {
  id: string;
  name: string;
  background: [string, string];
  hueRange: [number, number];
  satRange: [number, number];
  lightRange: [number, number];
  physics: ThemePhysics;
  emitPattern: EmitPattern;
  particleShape: ParticleShape;
  specialEffect: SpecialEffect;
}
