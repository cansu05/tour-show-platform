"use client";

import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import heroImage from "@/assets/hero-2.png";

type Props = {
  count: number;
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  actionLabel: string;
  onClick: () => void;
};

export function MonthlyAdvantageHero({
  count,
  eyebrow,
  title,
  titleAccent,
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
        borderRadius: 3,
        minHeight: { xs: 220, sm: 260, md: 250 },
        px: { xs: 3, md: 4.5 },
        py: { xs: 2.6, md: 3.2 },
        backgroundImage: `linear-gradient(90deg, rgba(5,38,58,0.48) 0%, rgba(5,38,58,0.28) 42%, rgba(5,38,58,0.06) 100%), url(${heroImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: { xs: "center", md: "center 42%" },
        boxShadow: "0 24px 54px rgba(5,63,92,0.22)",
        color: "common.white",
      }}
    >
      <Stack
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: { xs: 150, sm: 190, md: 170 },
        }}
      >
        <Stack spacing={1.1} sx={{ width: "min(100%, 520px)" }}>
          <Box
            sx={{
              width: "fit-content",
              borderRadius: 999,
              px: 1.2,
              py: 0.45,
              bgcolor: "common.white",
              color: "primary.main",
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              boxShadow: "0 8px 18px rgba(15,23,42,0.16)",
            }}
          >
            {eyebrow}
          </Box>

          <Box>
            <Typography variant="h2" sx={{ color: "common.white", fontSize: { xs: 34, md: 45 }, lineHeight: 1.02 }}>
              {title}{" "}
              <Box component="span" sx={{ color: "#FFC36B" }}>
                {titleAccent}
              </Box>
            </Typography>
            <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.92)", fontSize: { xs: 15, md: 17 }, lineHeight: 1.45 }}>
              {subtitle}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<LocalOfferRoundedIcon />}
            onClick={onClick}
            sx={{
              width: "fit-content",
              minHeight: 48,
              px: 3,
              borderRadius: 999,
              bgcolor: "#E11D48",
              color: "common.white",
              fontWeight: 900,
              boxShadow: "0 14px 28px rgba(225,29,72,0.28)",
              "&:hover": { bgcolor: "#BE123C" },
            }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
