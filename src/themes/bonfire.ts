import { Theme } from './types';
export const bonfire: Theme = {
  id: 'bonfire', name: 'Bonfire',
  background: ['#0a0500', '#150800'],
  hueRange: [10, 45], satRange: [80, 100], lightRange: [50, 80],
  physics: { gravity: -0.3, viscosity: 0.1, defaultCount: 400, defaultSize: 3, defaultLifeSpan: 2.0, defaultTrail: 0.5, defaultGlow: 0.7 },
  emitPattern: 'upward', particleShape: 'circle', specialEffect: 'flicker',
};
