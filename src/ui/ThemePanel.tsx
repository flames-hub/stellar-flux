import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { C, R, F } from '../constants/theme';
import { useParticleStore } from '../store/useParticleStore';
import { themeList } from '../themes';

export function ThemePanel() {
  const activePanel = useParticleStore((s) => s.activePanel);
  const activeThemeId = useParticleStore((s) => s.activeThemeId);
  const setTheme = useParticleStore((s) => s.setTheme);

  if (activePanel !== 'theme') return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>THEMES</Text>
      {themeList.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[styles.row, activeThemeId === theme.id && styles.rowActive]}
          onPress={() => setTheme(theme.id)} activeOpacity={0.7}
        >
          <View style={[styles.swatch, { backgroundColor: theme.background[0] }]}>
            <View style={[styles.swatchInner, { backgroundColor: theme.background[1] }]} />
          </View>
          <Text style={[styles.name, activeThemeId === theme.id && styles.nameActive]}>
            {theme.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute', top: 80, right: 72, width: 180,
    backgroundColor: C.bgRaised, borderWidth: 1, borderColor: C.borderDefault,
    borderRadius: R.xl, padding: 14,
  },
  heading: { fontSize: F.label, color: C.textTertiary, letterSpacing: 0.5, marginBottom: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8,
    borderRadius: R.lg, marginBottom: 4,
  },
  rowActive: { borderWidth: 1, borderColor: C.accent, backgroundColor: C.accentMuted },
  swatch: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  swatchInner: { width: 14, height: 14, borderRadius: 7 },
  name: { fontSize: F.sm, color: C.textSecondary },
  nameActive: { color: C.textPrimary, fontWeight: '600' },
});
