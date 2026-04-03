import type {ThemeOptions} from '@mui/material/styles';

export const componentOverrides: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true
    },
    styleOverrides: {
      root: {
        borderRadius: 4,
        paddingInline: 22,
        minHeight: 50,
        fontWeight: 700
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 4
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        fontWeight: 700,
        minHeight: 36
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        backgroundColor: '#ffffff',
        transition: 'box-shadow 160ms ease, border-color 160ms ease',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(5, 63, 92, 0.18)',
          borderWidth: 1
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(5, 63, 92, 0.34)'
        },
        '&.Mui-focused': {
          boxShadow: '0 0 0 4px rgba(66, 158, 189, 0.14)'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3386A3',
          borderWidth: 2
        }
      },
      input: {
        paddingBlock: 15
      },
      multiline: {
        paddingBlock: 2
      }
    }
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: '#35586A',
        fontWeight: 600
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 4
      }
    }
  }
};
