"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { radiusTokens } from "@/theme/tokens";

type Props = {
  count: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onClick: () => void;
};

export function MonthlyAdvantageHero({
  count,
  eyebrow,
  title,
  subtitle,
  actionLabel,
  onClick,
}: Props) {
  if (count === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: `${radiusTokens.lg}px`,
        minHeight: { xs: 140, sm: 145, md: 130 },
        mx: { xs: 1.3, md: 2.6 },
        px: { xs: 2, md: 4.2 },
        py: { xs: 1.8, md: 1.7 },
        backgroundImage:
          "linear-gradient(90deg, rgba(0,58,113,0.94) 0%, rgba(0,71,132,0.7) 44%, rgba(0,91,153,0.18) 100%), url('/assets/hero-1.png')",
        backgroundSize: "cover",
        backgroundPosition: { xs: "center", md: "center 52%" },
        color: "common.white",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={2}
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: { xs: 98, md: 96 },
        }}
      >
        <Stack spacing={1} sx={{ width: "min(100%, 520px)" }}>
          <Box
            sx={{
              width: "fit-content",
              borderRadius: `${radiusTokens.sm}px`,
              px: 1.5,
              py: 0.8,
              bgcolor: "#FF7800",
              color: "common.white",
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </Box>

          <Box>
            <Typography
              variant="h2"
              sx={{
                color: "common.white",
                fontSize: { xs: 24, md: 31 },
                lineHeight: 1.04,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: 13, md: 14 },
                lineHeight: 1.45,
                fontWeight: 700,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={onClick}
          sx={{
            width: "fit-content",
            minHeight: 50,
            px: 2.5,
            borderRadius: `${radiusTokens.md}px`,
            bgcolor: "common.white",
            color: "#FF7800",
            fontSize: 13,
            fontWeight: 900,
            boxShadow: "0 12px 24px rgba(0,32,72,0.14)",
            "&:hover": { bgcolor: "#FFF7EF" },
          }}
        >
          {actionLabel}
        </Button>
      </Stack>
    </Box>
  );
}
