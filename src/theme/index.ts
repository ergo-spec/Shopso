export const colors = {
  light: {
    primary: '#0f172a', // Slate 900
    primaryLight: '#334155', // Slate 700
    primaryDark: '#020617', // Slate 950
    accent: '#4f46e5', // Indigo 600
    accentLight: '#e0e7ff', // Indigo 100
    success: '#10b981', // Emerald 500
    successLight: '#d1fae5', // Emerald 100
    warning: '#f59e0b', // Amber 500
    warningLight: '#fef3c7', // Amber 100
    danger: '#ef4444', // Red 500
    dangerLight: '#fee2e2', // Red 100
    background: '#f8fafc', // Slate 50
    card: '#ffffff',
    text: '#0f172a', // Slate 900
    textMuted: '#64748b', // Slate 500
    textLight: '#94a3b8', // Slate 400
    border: '#e2e8f0', // Slate 200
    inputBg: '#ffffff',
    shadow: '#0f172a',
  },
  dark: {
    primary: '#f8fafc', // Slate 50
    primaryLight: '#cbd5e1', // Slate 300
    primaryDark: '#ffffff',
    accent: '#818cf8', // Indigo 400
    accentLight: '#312e81', // Indigo 900
    success: '#34d399', // Emerald 400
    successLight: '#064e3b', // Emerald 900
    warning: '#fbbf24', // Amber 400
    warningLight: '#78350f', // Amber 900
    danger: '#f87171', // Red 400
    dangerLight: '#7f1d1d', // Red 900
    background: '#090d16', // Custom deep dark
    card: '#131926',
    text: '#f8fafc', // Slate 50
    textMuted: '#94a3b8', // Slate 400
    textLight: '#64748b', // Slate 500
    border: '#1e293b', // Slate 800
    inputBg: '#1e293b',
    shadow: '#000000',
  }
};

export type ThemeColors = typeof colors.light;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
};

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
};
