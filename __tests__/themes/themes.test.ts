import { themes, themeList, DEFAULT_THEME_ID } from '../../src/themes';
import { Theme } from '../../src/themes/types';

describe('Theme definitions', () => {
  test('all 4 themes are registered', () => {
    expect(themeList).toHaveLength(4);
    expect(Object.keys(themes)).toEqual(['cosmos', 'deep-sea', 'bonfire', 'matrix']);
  });
  test('default theme exists', () => {
    expect(themes[DEFAULT_THEME_ID]).toBeDefined();
  });
  test.each(themeList)('$name has valid hue range', (theme: Theme) => {
    const [min, max] = theme.hueRange;
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeLessThanOrEqual(360);
    expect(min).toBeLessThan(max);
  });
  test.each(themeList)('$name has valid physics defaults', (theme: Theme) => {
    const p = theme.physics;
    expect(p.gravity).toBeGreaterThanOrEqual(-1);
    expect(p.gravity).toBeLessThanOrEqual(1);
    expect(p.viscosity).toBeGreaterThanOrEqual(0);
    expect(p.viscosity).toBeLessThanOrEqual(1);
    expect(p.defaultCount).toBeGreaterThanOrEqual(50);
    expect(p.defaultCount).toBeLessThanOrEqual(1500);
  });
  test.each(themeList)('$name has two background colors', (theme: Theme) => {
    expect(theme.background).toHaveLength(2);
    theme.background.forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });
});
