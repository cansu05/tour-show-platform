import type { ThemeOptions } from "@mui/material/styles";
import { radiusTokens } from "@/theme/tokens";

export const componentOverrides: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: radiusTokens.sm,
        paddingInline: 22,
        minHeight: 50,
        fontWeight: 700,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: radiusTokens.sm,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: radiusTokens.sm,
        fontWeight: 700,
        minHeight: 36,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: radiusTokens.sm,
        backgroundColor: "#ffffff",
      },
      notchedOutline: {
        border: 0,
      },
      input: {
        paddingBlock: 15,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: radiusTokens.sm,
      },
    },
  },
};
