import {colorTokens} from '@/theme/tokens';

export const paletteTokens = {
  primary: {
    main: colorTokens.primaryDark,
    light: colorTokens.primaryMedium,
    dark: '#3E556D',
    contrastText: '#ffffff'
  },
  secondary: {
    main: colorTokens.accentBlue,
    light: colorTokens.accentSlate,
    dark: '#62788D',
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
