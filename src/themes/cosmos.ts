import { Theme } from './types';
export const cosmos: Theme = {
  id: 'cosmos', name: 'Cosmos',
  background: ['#050520', '#0a0530'],
  hueRange: [200, 280], satRange: [60, 80], lightRange: [70, 90],
  physics: { gravity: 0.02, viscosity: 0.15, defaultCount: 300, defaultSize: 4, defaultLifeSpan: 5.0, defaultTrail: 0.4, defaultGlow: 0.6 },
  emitPattern: 'radial', particleShape: 'circle', specialEffect: 'shooting-star',
};
