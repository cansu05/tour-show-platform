import type {ThemeOptions} from '@mui/material/styles';

export const componentOverrides: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true
    },
    styleOverrides: {
      root: {
        borderRadius: 14,
        paddingInline: 22,
        minHeight: 50,
        fontWeight: 700
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 22
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        fontWeight: 700,
        minHeight: 36
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundColor: '#ffffff'
      },
      notchedOutline: {
        border: 0
      },
      input: {
        paddingBlock: 15
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 20
      }
    }
  }
};
