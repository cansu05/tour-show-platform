"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useState } from "react";
import type { AppLocale } from "@/constants/locales";
import { Link } from "@/i18n/navigation";
import { radiusTokens } from "@/theme/tokens";
import type { Tour } from "@/types/tour";
import { isUploadedTourAsset } from "@/utils/media";
import { getTourPriceSummary } from "@/utils/tour-pricing";

type Props = {
  tour: Tour;
  locale: AppLocale;
};

export function TourCard({ tour, locale }: Props) {
  const tTour = useTranslations("tour");
  const [isNavigating, setIsNavigating] = useState(false);
  const priceSummary = getTourPriceSummary(tour.pricing, tour.campaignPrice);
  const useUnoptimizedImage = isUploadedTourAsset(tour.coverImage);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    setIsNavigating(true);
  };

  return (
    <Card
      sx={{
        height: "100%",
        overflow: "hidden",
        position: "relative",
        borderRadius: `${radiusTokens.md}px`,
        boxShadow: "0 14px 36px rgba(8, 48, 78, 0.08)",
        bgcolor: "#ffffff",
      }}
    >
      <CardActionArea
        component={Link}
        href={`/tours/${tour.slug}`}
        locale={locale}
        prefetch
        onClick={handleClick}
        aria-busy={isNavigating}
        sx={{
          height: "100%",
          alignItems: "stretch",
          color: "inherit",
          "&:hover .tour-card-cta": {
            bgcolor: "#FF7800",
            color: "#FFFFFF",
            borderColor: "#FF7800",
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{ position: "relative", minHeight: 248, overflow: "hidden" }}
          >
            <Image
              src={tour.coverImage}
              alt={tour.title}
              fill
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={false}
              unoptimized={useUnoptimizedImage}
              style={{
                objectFit: "cover",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,40,70,0.02) 40%, rgba(0,40,70,0.18) 100%)",
              }}
            />
            {typeof tour.campaignPrice === "number" ? (
              <Chip
                label={`${tour.campaignPrice} ${priceSummary.currency}`}
                sx={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  bgcolor: "#FF7800",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  borderRadius: `${radiusTokens.sm}px`,
                  px: 1.2,
                  boxShadow: "0 10px 22px rgba(255, 120, 0, 0.26)",
                }}
              />
            ) : null}
          </Box>

          <CardContent
            sx={{
              p: 2.35,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              bgcolor: "#FFFFFF",
            }}
          >
            <Stack spacing={1.2} sx={{ height: "100%", minHeight: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: { xs: 180, md: 202 },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: "#092D42",
                    lineHeight: 1.2,
                    minHeight: { xs: 64, md: 72 },
                  }}
                >
                  {tour.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.6,
                    lineHeight: 1.62,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tour.shortDescription}
                </Typography>
              </Box>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                gap={1.5}
                sx={{ mt: "auto" }}
              >
                <Stack direction="row" spacing={2.5} alignItems="flex-end">
                  <Stack spacing={0.2}>
                    <Typography variant="caption" color="text.secondary">
                      {tTour("adultPrice")}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#064568" }}>
                      {typeof priceSummary.minAdultPrice === "number"
                        ? `${priceSummary.minAdultPrice} ${priceSummary.currency}`
                        : tTour("priceOnRequest")}
                    </Typography>
                  </Stack>
                  {typeof priceSummary.minChildPrice === "number" ? (
                    <Stack spacing={0.2}>
                      <Typography variant="caption" color="text.secondary">
                        {tTour("childPrice")}
                      </Typography>
                      <Typography variant="h5" sx={{ color: "#064568" }}>
                        {priceSummary.minChildPrice} {priceSummary.currency}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>

                <Stack
                  className="tour-card-cta"
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={0.45}
                  sx={{
                    minWidth: 150,
                    minHeight: 36,
                    px: 1.45,
                    borderRadius: `${radiusTokens.md}px`,
                    border: "1px solid rgba(255, 120, 0, 0.24)",
                    bgcolor: "#FFFFFF",
                    color: "#FF7800",
                    flexShrink: 0,
                    transition: "all 160ms ease",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800, lineHeight: 1 }}
                  >
                    {tTour("detailsCta")}
                  </Typography>
                  <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Stack>
      </CardActionArea>

      {isNavigating ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255,255,255,0.74)",
            backdropFilter: "blur(3px)",
          }}
        >
          <CircularProgress size={34} thickness={4} />
        </Box>
      ) : null}
    </Card>
  );
}
