import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { C, R, F } from '../constants/theme';
import { useParticleStore } from '../store/useParticleStore';
import { usePresetStore } from '../store/usePresetStore';
import { themes } from '../themes';

export function SavePanel() {
  const activePanel = useParticleStore((s) => s.activePanel);
  const activeThemeId = useParticleStore((s) => s.activeThemeId);
  const overrides = useParticleStore((s) => s.overrides);
  const touchMode = useParticleStore((s) => s.touchMode);
  const clusterBlur = useParticleStore((s) => s.clusterBlur);
  const setTheme = useParticleStore((s) => s.setTheme);
  const setOverride = useParticleStore((s) => s.setOverride);
  const setTouchMode = useParticleStore((s) => s.setTouchMode);

  const presets = usePresetStore((s) => s.presets);
  const savePreset = usePresetStore((s) => s.savePreset);
  const deletePreset = usePresetStore((s) => s.deletePreset);
  const loadPreset = usePresetStore((s) => s.loadPreset);

  const [name, setName] = useState('');

  if (activePanel !== 'save') return null;

  const handleSave = () => {
    if (!name.trim()) return;
    savePreset(name.trim(), activeThemeId, overrides, touchMode, clusterBlur);
    setName('');
  };

  const handleLoad = (id: string) => {
    const preset = loadPreset(id);
    if (!preset) return;
    setTheme(preset.themeId);
    setTimeout(() => {
      Object.entries(preset.overrides).forEach(([key, val]) => {
        if (val !== undefined) setOverride(key as any, val);
      });
      setTouchMode(preset.touchMode);
      if (preset.clusterBlur !== clusterBlur) {
        useParticleStore.getState().toggleClusterBlur();
      }
    }, 50);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>PRESETS</Text>
      <View style={styles.saveRow}>
        <TextInput
          style={styles.input} value={name} onChangeText={setName}
          placeholder="Preset name..." placeholderTextColor={C.textTertiary}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {presets.length === 0 && <Text style={styles.empty}>No saved presets</Text>}
        {presets.map((p) => (
          <View key={p.id} style={styles.presetRow}>
            <TouchableOpacity style={styles.presetInfo} onPress={() => handleLoad(p.id)} activeOpacity={0.7}>
              <Text style={styles.presetName}>{p.name}</Text>
              <Text style={styles.presetTheme}>{themes[p.themeId]?.name ?? p.themeId}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePreset(p.id)} activeOpacity={0.7} hitSlop={8}>
              <Trash2 size={14} color={C.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute', top: 80, right: 72, width: 220, maxHeight: 360,
    backgroundColor: C.bgRaised, borderWidth: 1, borderColor: C.borderDefault,
    borderRadius: R.xl, padding: 14,
  },
  heading: { fontSize: F.label, color: C.textTertiary, letterSpacing: 0.5, marginBottom: 10 },
  saveRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: {
    flex: 1, backgroundColor: C.bgElevated, borderWidth: 1, borderColor: C.borderDefault,
    borderRadius: R.md, paddingHorizontal: 10, paddingVertical: 6, fontSize: F.sm, color: C.textPrimary,
  },
  saveBtn: {
    backgroundColor: C.accent, borderRadius: R.md,
    paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'center',
  },
  saveBtnText: { fontSize: F.sm, color: C.textOnAccent, fontWeight: '600' },
  list: { maxHeight: 240 },
  empty: { fontSize: F.sm, color: C.textTertiary, textAlign: 'center', padding: 16 },
  presetRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.borderSubtle,
  },
  presetInfo: { flex: 1 },
  presetName: { fontSize: F.sm, color: C.textPrimary },
  presetTheme: { fontSize: F.label, color: C.textTertiary },
});
