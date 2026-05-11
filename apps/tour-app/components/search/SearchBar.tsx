"use client";

import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { radiusTokens } from "@/theme/tokens";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onVoiceClick: () => void;
};

export function SearchBar({ value, onChange, onVoiceClick }: Props) {
  const tHome = useTranslations("home");

  return (
    <Stack direction={{ xs: "column", sm: "row" }} gap={{ xs: 0.8, md: 1.2 }} alignItems="stretch">
      <TextField
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={tHome("searchPlaceholder")}
        aria-label={tHome("searchAria")}
        size="medium"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 22, color: "#6F879F" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: 0.45 }}>
                {value ? (
                  <IconButton
                    aria-label={tHome("clearSearch")}
                    onClick={() => onChange("")}
                    sx={{
                      bgcolor: "rgba(5,63,92,0.08)",
                      "&:hover": { bgcolor: "rgba(5,63,92,0.15)" },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                ) : null}
                <IconButton
                  aria-label={tHome("voiceSearch")}
                  onClick={onVoiceClick}
                  sx={{
                    color: "#7A8DA3",
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "rgba(10,77,145,0.08)" },
                  }}
                >
                  <MicIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: `${radiusTokens.md}px`,
            bgcolor: "background.paper",
            boxShadow:
              "0 2px 10px rgba(7, 0, 92, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            pr: 0.8,
            minHeight: { xs: 44, md: 52 },
            "& fieldset": {
              borderWidth: 1.5,
              borderColor: "rgba(190,207,224,1)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(106, 112, 117, 0.42)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(10,77,145,0.55)",
              borderWidth: 1.5,
            },
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: 14, md: 15 },
            fontWeight: 600,
            py: { xs: 1.05, md: 1.8 },
          },
        }}
      />
      <Button
        variant="contained"
        sx={{
          display: "inline-flex",
          flex: "0 0 auto",
          width: { xs: "100%", sm: "auto" },
          minWidth: { xs: 0, sm: 144, md: 154 },
          minHeight: { xs: 42, md: 52 },
          borderRadius: `${radiusTokens.md}px`,
          bgcolor: "#FF7800",
          fontSize: 14,
          fontWeight: 900,
          "&:hover": { bgcolor: "#E76C00" },
        }}
      >
        Turu Ara
      </Button>
    </Stack>
  );
}
