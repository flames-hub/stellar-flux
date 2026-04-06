import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
} from 'react-native-reanimated';
import { Palette, Settings, Save } from 'lucide-react-native';
import { C } from '../constants/theme';
import { useParticleStore } from '../store/useParticleStore';

const AUTO_HIDE_MS = 5000;

export function FloatingButtons() {
  const setPanel = useParticleStore((s) => s.setPanel);
  const activePanel = useParticleStore((s) => s.activePanel);
  const immersive = useParticleStore((s) => s.immersive);

  const opacity = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    opacity.value = withTiming(1, { duration: 150 });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!activePanel) {
        opacity.value = withTiming(0, { duration: 300 });
      }
    }, AUTO_HIDE_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activePanel]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (immersive) return null;

  const handlePress = (panel: 'theme' | 'customize' | 'save') => {
    resetTimer();
    setPanel(panel);
  };

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents="box-none">
      <TouchableOpacity
        style={[styles.button, activePanel === 'theme' && styles.buttonActive]}
        onPress={() => handlePress('theme')} activeOpacity={0.7}
      >
        <Palette size={18} color={activePanel === 'theme' ? C.accent : C.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, activePanel === 'customize' && styles.buttonActive]}
        onPress={() => handlePress('customize')} activeOpacity={0.7}
      >
        <Settings size={18} color={activePanel === 'customize' ? C.accent : C.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, activePanel === 'save' && styles.buttonActive]}
        onPress={() => handlePress('save')} activeOpacity={0.7}
      >
        <Save size={18} color={activePanel === 'save' ? C.accent : C.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', right: 16, top: 80, gap: 12, alignItems: 'center' },
  button: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(22,21,19,0.6)', borderWidth: 1, borderColor: C.borderDefault,
    justifyContent: 'center', alignItems: 'center',
  },
  buttonActive: { borderColor: C.accent, backgroundColor: 'rgba(22,21,19,0.8)' },
});
