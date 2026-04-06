import { Theme } from './types';
import { cosmos } from './cosmos';
import { deepSea } from './deep-sea';
import { bonfire } from './bonfire';
import { matrix } from './matrix';

export const themes: Record<string, Theme> = { cosmos, 'deep-sea': deepSea, bonfire, matrix };
export const themeList: Theme[] = [cosmos, deepSea, bonfire, matrix];
export const DEFAULT_THEME_ID = 'cosmos';
export { type Theme, type ThemePhysics, type EmitPattern, type ParticleShape, type SpecialEffect } from './types';
