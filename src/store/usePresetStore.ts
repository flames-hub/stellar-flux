import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParticleParams, TouchMode } from '../engine/types';

export interface SavedPreset {
  id: string; name: string; themeId: string;
  overrides: Partial<ParticleParams>;
  touchMode: TouchMode; clusterBlur: boolean; createdAt: number;
}

interface PresetState {
  presets: SavedPreset[];
  savePreset: (name: string, themeId: string, overrides: Partial<ParticleParams>, touchMode: TouchMode, clusterBlur: boolean) => void;
  loadPreset: (id: string) => SavedPreset | undefined;
  deletePreset: (id: string) => void;
}

export const usePresetStore = create<PresetState>()(
  persist(
    (set, get) => ({
      presets: [],
      savePreset: (name, themeId, overrides, touchMode, clusterBlur) =>
        set((state) => ({
          presets: [...state.presets, {
            id: `preset-${Date.now()}`, name, themeId, overrides, touchMode, clusterBlur, createdAt: Date.now(),
          }],
        })),
      loadPreset: (id) => get().presets.find((p) => p.id === id),
      deletePreset: (id) => set((state) => ({ presets: state.presets.filter((p) => p.id !== id) })),
    }),
    { name: 'stellar-flux-presets', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
