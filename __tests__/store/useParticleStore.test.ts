import { useParticleStore } from '../../src/store/useParticleStore';

describe('useParticleStore', () => {
  beforeEach(() => {
    useParticleStore.setState({
      activeThemeId: 'cosmos', overrides: {}, uiVisible: true,
      activePanel: null, touchMode: 'emit', clusterBlur: true, immersive: false,
    });
  });

  test('setTheme changes theme and resets overrides', () => {
    useParticleStore.getState().setOverride('count', 999);
    useParticleStore.getState().setTheme('bonfire');
    const state = useParticleStore.getState();
    expect(state.activeThemeId).toBe('bonfire');
    expect(state.overrides).toEqual({});
  });

  test('setOverride applies specific param', () => {
    useParticleStore.getState().setOverride('count', 800);
    expect(useParticleStore.getState().overrides.count).toBe(800);
  });

  test('getEffectiveParams uses theme defaults when no overrides', () => {
    const params = useParticleStore.getState().getEffectiveParams();
    expect(params.count).toBe(300);
    expect(params.gravity).toBeCloseTo(0.02);
  });

  test('getEffectiveParams uses override when set', () => {
    useParticleStore.getState().setOverride('count', 1000);
    const params = useParticleStore.getState().getEffectiveParams();
    expect(params.count).toBe(1000);
    expect(params.gravity).toBeCloseTo(0.02);
  });

  test('toggleImmersive toggles immersive and closes panel', () => {
    useParticleStore.getState().setPanel('theme');
    useParticleStore.getState().toggleImmersive();
    const state = useParticleStore.getState();
    expect(state.immersive).toBe(true);
    expect(state.activePanel).toBeNull();
  });

  test('setPanel toggles same panel off', () => {
    useParticleStore.getState().setPanel('theme');
    expect(useParticleStore.getState().activePanel).toBe('theme');
    useParticleStore.getState().setPanel('theme');
    expect(useParticleStore.getState().activePanel).toBeNull();
  });
});
