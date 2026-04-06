import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ParticleCanvas } from '../src/renderer/ParticleCanvas';
import { FloatingButtons } from '../src/ui/FloatingButtons';
import { ThemePanel } from '../src/ui/ThemePanel';
import { CustomizePanel } from '../src/ui/CustomizePanel';
import { SavePanel } from '../src/ui/SavePanel';
import { useParticleStore } from '../src/store/useParticleStore';
import { C, F } from '../src/constants/theme';

export default function MainScreen() {
  const immersive = useParticleStore((s) => s.immersive);

  return (
    <View style={styles.container}>
      <ParticleCanvas />
      {!immersive && (
        <>
          <StatusInfo />
          <FloatingButtons />
          <ThemePanel />
          <CustomizePanel />
          <SavePanel />
        </>
      )}
    </View>
  );
}

function StatusInfo() {
  const params = useParticleStore((s) => s.getEffectiveParams());
  return (
    <View style={styles.status}>
      <Text style={styles.statusText}>{params.count} particles</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  status: { position: 'absolute', top: 52, left: 16 },
  statusText: { fontSize: F.label, color: C.textTertiary, letterSpacing: 0.5 },
});
