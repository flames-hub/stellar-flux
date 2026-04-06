// src/constants/theme.ts
export const C = {
  bgBase: '#0b0a09',
  bgElevated: '#161513',
  bgRaised: '#1e1d1b',
  bgOverlay: '#272523',
  accent: '#f59e0b',
  accentHover: '#fbbf24',
  accentMuted: 'rgba(245,158,11,0.15)',
  accentText: '#fcd34d',
  textPrimary: '#f2f0ec',
  textSecondary: '#a8a29e',
  textTertiary: '#78716c',
  textOnAccent: '#1c1a18',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',
  success: '#22c55e',
  error: '#ef4444',
  info: '#60a5fa',
} as const;

export const R = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, pill: 999 } as const;
export const S = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const F = { display: 48, h1: 36, h2: 28, h3: 22, h4: 18, lg: 17, base: 15, sm: 13, caption: 12, label: 11 } as const;
