import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, R, F } from '../constants/theme';
import { useParticleStore } from '../store/useParticleStore';
import { Slider } from './Slider';

const TOUCH_MODES = ['emit', 'repulse', 'both'] as const;
const TOUCH_MODE_LABELS = { emit: 'Emit', repulse: 'Repulse', both: 'Both' };

export function CustomizePanel() {
  const activePanel = useParticleStore((s) => s.activePanel);
  const setOverride = useParticleStore((s) => s.setOverride);
  const touchMode = useParticleStore((s) => s.touchMode);
  const setTouchMode = useParticleStore((s) => s.setTouchMode);
  const clusterBlur = useParticleStore((s) => s.clusterBlur);
  const toggleClusterBlur = useParticleStore((s) => s.toggleClusterBlur);
  const params = useParticleStore((s) => s.getEffectiveParams());

  if (activePanel !== 'customize') return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>CUSTOMIZE</Text>
      <Slider label="Count" value={params.count} min={50} max={1500} step={10} onChange={(v) => setOverride('count', v)} />
      <Slider label="Size" value={params.size} min={1} max={12} step={0.5} onChange={(v) => setOverride('size', v)} />
      <Slider label="Life Span" value={params.lifeSpan} min={0.5} max={10} step={0.5} unit="s" onChange={(v) => setOverride('lifeSpan', v)} />
      <Slider label="Glow" value={params.glow} min={0} max={1} step={0.05} onChange={(v) => setOverride('glow', v)} />
      <Slider label="Viscosity" value={params.viscosity} min={0} max={1} step={0.05} onChange={(v) => setOverride('viscosity', v)} />
      <Slider label="Trail" value={params.trail} min={0} max={1} step={0.05} onChange={(v) => setOverride('trail', v)} />
      <Slider label="Gravity" value={params.gravity} min={-1} max={1} step={0.05} onChange={(v) => setOverride('gravity', v)} />

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Cluster Blur</Text>
        <TouchableOpacity
          style={[styles.toggle, clusterBlur && styles.toggleOn]}
          onPress={toggleClusterBlur} activeOpacity={0.7}
        >
          <View style={[styles.toggleThumb, clusterBlur && styles.toggleThumbOn]} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.toggleLabel, { marginTop: 10, marginBottom: 6 }]}>Touch Mode</Text>
      <View style={styles.segmented}>
        {TOUCH_MODES.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.segment, touchMode === mode && styles.segmentActive]}
            onPress={() => setTouchMode(mode)} activeOpacity={0.7}
          >
            <Text style={[styles.segmentText, touchMode === mode && styles.segmentTextActive]}>
              {TOUCH_MODE_LABELS[mode]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute', top: 80, right: 72, width: 240,
    backgroundColor: C.bgRaised, borderWidth: 1, borderColor: C.borderDefault,
    borderRadius: R.xl, padding: 16,
  },
  heading: { fontSize: F.label, color: C.textTertiary, letterSpacing: 0.5, marginBottom: 12 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  toggleLabel: { fontSize: F.caption, color: C.textSecondary },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', padding: 2, justifyContent: 'center' },
  toggleOn: { backgroundColor: C.accent },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.textSecondary },
  toggleThumbOn: { alignSelf: 'flex-end', backgroundColor: C.textOnAccent },
  segmented: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: R.md, overflow: 'hidden' },
  segment: { flex: 1, paddingVertical: 6, alignItems: 'center' },
  segmentActive: { backgroundColor: C.accent },
  segmentText: { fontSize: F.label, color: C.textSecondary, fontWeight: '600' },
  segmentTextActive: { color: C.textOnAccent },
});
