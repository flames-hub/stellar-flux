import { Theme } from './types';
export const deepSea: Theme = {
  id: 'deep-sea', name: 'Deep Sea',
  background: ['#020815', '#041525'],
  hueRange: [170, 200], satRange: [50, 70], lightRange: [50, 70],
  physics: { gravity: -0.15, viscosity: 0.6, defaultCount: 200, defaultSize: 6, defaultLifeSpan: 6.0, defaultTrail: 0.3, defaultGlow: 0.4 },
  emitPattern: 'upward', particleShape: 'circle', specialEffect: 'current',
};
