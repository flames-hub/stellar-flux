import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { C, F } from '../constants/theme';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 0.1, unit = '', onChange }: SliderProps) {
  const sliderWidth = useSharedValue(0);
  const fraction = (value - min) / (max - min);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const w = sliderWidth.value;
      if (w <= 0) return;
      const frac = Math.max(0, Math.min(1, e.x / w));
      const raw = min + frac * (max - min);
      const stepped = Math.round(raw / step) * step;
      runOnJS(onChange)(stepped);
    })
    .minDistance(0);

  const tap = Gesture.Tap()
    .onEnd((e) => {
      const w = sliderWidth.value;
      if (w <= 0) return;
      const frac = Math.max(0, Math.min(1, e.x / w));
      const raw = min + frac * (max - min);
      const stepped = Math.round(raw / step) * step;
      runOnJS(onChange)(stepped);
    });

  const composed = Gesture.Race(pan, tap);
  const display = step >= 1 ? value.toFixed(0) : value.toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{display}{unit}</Text>
      </View>
      <GestureDetector gesture={composed}>
        <View
          style={styles.track}
          onLayout={(e) => { sliderWidth.value = e.nativeEvent.layout.width; }}
        >
          <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
          <View style={[styles.thumb, { left: `${fraction * 100}%` }]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: F.caption, color: C.textSecondary },
  value: { fontSize: F.caption, color: C.accentText },
  track: { height: 24, justifyContent: 'center', position: 'relative' },
  fill: {
    position: 'absolute', height: 4, top: 10, left: 0,
    backgroundColor: C.accent, borderRadius: 2,
  },
  thumb: {
    position: 'absolute', width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.accent, top: 4, marginLeft: -8,
    borderWidth: 2, borderColor: C.bgRaised,
  },
});
