import {colorTokens} from '@/theme/tokens';

export const paletteTokens = {
  primary: {
    main: colorTokens.primaryDark,
    light: colorTokens.primaryMedium,
    dark: '#032A3C',
    contrastText: '#ffffff'
  },
  secondary: {
    main: colorTokens.accentOrange,
    light: colorTokens.accentYellow,
    dark: '#C76707',
    contrastText: '#ffffff'
  },
  background: {
    default: colorTokens.surface,
    paper: colorTokens.surfaceElevated
  },
  text: {
    primary: colorTokens.textPrimary,
    secondary: colorTokens.textSecondary
  },
  divider: colorTokens.strokeSoft
} as const;
