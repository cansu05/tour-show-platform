import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import type {
  TourListHeroProps,
  TourQuickFilter,
} from "@/features/tour-list/tour-list.types";
import { radiusTokens } from "@/theme/tokens";

const HERO_BADGES: Array<{
  filter: TourQuickFilter;
  labelKey: "quickFilterToday" | "quickFilterFamily" | "quickFilterEconomy";
  icon: ReactElement;
}> = [
  { filter: "today", labelKey: "quickFilterToday", icon: <CalendarMonthRoundedIcon /> },

  {
    filter: "family",
    labelKey: "quickFilterFamily",
    icon: <FamilyRestroomRoundedIcon />,
  },

  { filter: "economy", labelKey: "quickFilterEconomy", icon: <LocalOfferRoundedIcon /> },
];

export function TourListHero({
  activeQuickFilter,
  onQuickFilterChange,
}: TourListHeroProps) {
  const tHome = useTranslations("home");

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: `${radiusTokens.lg}px`,
        minHeight: { xs: 470, sm: 450, md: 410 },
        px: { xs: 2, sm: 4, md: 8 },
        pt: { xs: 5.7, md: 6.2 },
        pb: { xs: 17.5, md: 14 },
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.84) 33%, rgba(255,255,255,0.34) 58%, rgba(255,255,255,0) 80%), url('/assets/hero-2.png')",
        backgroundSize: "cover",
        backgroundPosition: { xs: "61% center", sm: "58% center", md: "center center" },
        boxShadow: "0 18px 44px rgba(26,86,130,0.13)",
        color: "#0A2D5D",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(245,251,255,0.42) 0%, rgba(245,251,255,0) 38%)",
          pointerEvents: "none",
        },
      }}
    >
      <Stack
        spacing={2}
        sx={{ position: "relative", zIndex: 1, width: { xs: "100%", md: 500 }, maxWidth: { xs: 330, md: 500 } }}
      >
        <Typography
          variant="h1"
          sx={{
            whiteSpace: "pre-line",
            color: "inherit",
            fontSize: { xs: 30, sm: 44, md: 48 },
            lineHeight: { xs: 1.04, md: 0.98 },
            letterSpacing: 0,
            maxWidth: 500,
            textShadow: "0 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          {tHome("landingHeroHeadline")}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 12.5, md: 15 },
            lineHeight: 1.48,
            color: "#506783",
            maxWidth: 390,
            fontWeight: 600,
          }}
        >
          {tHome("landingHeroDescription")}
        </Typography>
        <Stack
          direction="row"
          gap={0.9}
          flexWrap="wrap"
          sx={{ pt: 0.3, maxWidth: 560 }}
        >
          {HERO_BADGES.map((badge) => {
            const active = activeQuickFilter === badge.filter;

            return (
              <Chip
                key={badge.filter}
                icon={badge.icon}
                label={tHome(badge.labelKey)}
                clickable
                color={active ? "primary" : "default"}
                onClick={() => onQuickFilterChange(badge.filter)}
                sx={{
                  height: { xs: 36, md: 40 },
                  px: { xs: 0.9, md: 1.25 },
                  borderRadius: `${radiusTokens.lg}px`,
                  bgcolor: active ? "#00437D" : "rgba(255,255,255,0.96)",
                  color: active ? "#FFFFFF" : "#0A4C91",
                  fontSize: { xs: 11.2, md: 12 },
                  fontWeight: 800,
                  boxShadow: "0 8px 18px rgba(22,75,124,0.11)",
                  "& .MuiChip-icon": {
                    fontSize: 17,
                    color: active ? "#FFFFFF" : "#0A77C8",
                  },
                }}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
