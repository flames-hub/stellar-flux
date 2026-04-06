import { Theme } from './types';
export const matrix: Theme = {
  id: 'matrix', name: 'Matrix',
  background: ['#000500', '#001505'],
  hueRange: [130, 145], satRange: [80, 100], lightRange: [40, 70],
  physics: { gravity: 0.4, viscosity: 0.0, defaultCount: 500, defaultSize: 3, defaultLifeSpan: 3.0, defaultTrail: 0.7, defaultGlow: 0.5 },
  emitPattern: 'downward', particleShape: 'line', specialEffect: null,
};
