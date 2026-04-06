import { usePresetStore } from '../../src/store/usePresetStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('usePresetStore', () => {
  beforeEach(() => { usePresetStore.setState({ presets: [] }); });

  test('savePreset adds a preset', () => {
    usePresetStore.getState().savePreset('My Cosmos', 'cosmos', { count: 500 }, 'emit', true);
    const presets = usePresetStore.getState().presets;
    expect(presets).toHaveLength(1);
    expect(presets[0].name).toBe('My Cosmos');
    expect(presets[0].overrides.count).toBe(500);
  });

  test('loadPreset returns correct preset', () => {
    usePresetStore.getState().savePreset('Test', 'matrix', {}, 'both', false);
    const id = usePresetStore.getState().presets[0].id;
    expect(usePresetStore.getState().loadPreset(id)?.name).toBe('Test');
  });

  test('deletePreset removes preset', () => {
    usePresetStore.getState().savePreset('ToDelete', 'cosmos', {}, 'emit', true);
    const id = usePresetStore.getState().presets[0].id;
    usePresetStore.getState().deletePreset(id);
    expect(usePresetStore.getState().presets).toHaveLength(0);
  });

  test('loadPreset returns undefined for non-existent id', () => {
    expect(usePresetStore.getState().loadPreset('nope')).toBeUndefined();
  });
});
