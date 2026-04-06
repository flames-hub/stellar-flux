import { create } from 'zustand';
import { ParticleParams, TouchMode } from '../engine/types';
import { themes, DEFAULT_THEME_ID } from '../themes';

interface ParticleState {
  activeThemeId: string;
  overrides: Partial<ParticleParams>;
  uiVisible: boolean;
  activePanel: 'theme' | 'customize' | 'save' | null;
  touchMode: TouchMode;
  clusterBlur: boolean;
  immersive: boolean;

  setTheme: (id: string) => void;
  setOverride: (key: keyof ParticleParams, value: number) => void;
  toggleUI: () => void;
  setPanel: (panel: 'theme' | 'customize' | 'save' | null) => void;
  setTouchMode: (mode: TouchMode) => void;
  toggleClusterBlur: () => void;
  toggleImmersive: () => void;
  getEffectiveParams: () => ParticleParams;
}

export const useParticleStore = create<ParticleState>((set, get) => ({
  activeThemeId: DEFAULT_THEME_ID,
  overrides: {},
  uiVisible: true,
  activePanel: null,
  touchMode: 'emit',
  clusterBlur: true,
  immersive: false,

  setTheme: (id) => set({ activeThemeId: id, overrides: {}, activePanel: null }),
  setOverride: (key, value) => set((state) => ({ overrides: { ...state.overrides, [key]: value } })),
  toggleUI: () => set((state) => ({ uiVisible: !state.uiVisible })),
  setPanel: (panel) => set((state) => ({ activePanel: state.activePanel === panel ? null : panel })),
  setTouchMode: (mode) => set({ touchMode: mode }),
  toggleClusterBlur: () => set((state) => ({ clusterBlur: !state.clusterBlur })),
  toggleImmersive: () => set((state) => ({
    immersive: !state.immersive, activePanel: null, uiVisible: state.immersive,
  })),
  getEffectiveParams: () => {
    const state = get();
    const theme = themes[state.activeThemeId];
    if (!theme) {
      const fallback = themes[DEFAULT_THEME_ID]!;
      return {
        count: fallback.physics.defaultCount, size: fallback.physics.defaultSize,
        lifeSpan: fallback.physics.defaultLifeSpan, glow: fallback.physics.defaultGlow,
        viscosity: fallback.physics.viscosity, trail: fallback.physics.defaultTrail,
        gravity: fallback.physics.gravity,
      };
    }
    return {
      count: state.overrides.count ?? theme.physics.defaultCount,
      size: state.overrides.size ?? theme.physics.defaultSize,
      lifeSpan: state.overrides.lifeSpan ?? theme.physics.defaultLifeSpan,
      glow: state.overrides.glow ?? theme.physics.defaultGlow,
      viscosity: state.overrides.viscosity ?? theme.physics.viscosity,
      trail: state.overrides.trail ?? theme.physics.defaultTrail,
      gravity: state.overrides.gravity ?? theme.physics.gravity,
    };
  },
}));
