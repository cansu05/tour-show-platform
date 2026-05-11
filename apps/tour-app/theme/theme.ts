import {createTheme} from '@mui/material/styles';
import {componentOverrides} from '@/theme/components';
import {paletteTokens} from '@/theme/palette';
import {radiusTokens} from '@/theme/tokens';
import {typographyTokens} from '@/theme/typography';

export const appTheme = createTheme({
  palette: paletteTokens,
  typography: typographyTokens,
  spacing: 8,
  shape: {
    borderRadius: radiusTokens.sm
  },
  shadows: [
    'none',
    '0 8px 22px rgba(5, 63, 92, 0.08)',
    '0 12px 28px rgba(5, 63, 92, 0.10)',
    '0 16px 36px rgba(5, 63, 92, 0.13)',
    ...Array(21).fill('0 20px 45px rgba(5, 63, 92, 0.14)')
  ] as any,
  components: componentOverrides
});
