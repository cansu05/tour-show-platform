"use client";

import {useState} from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {Box, Chip, Grid2, Stack, Typography} from "@mui/material";
import {useLocale, useTranslations} from "next-intl";
import {FeedbackSnackbar} from "@/components/common/FeedbackSnackbar";
import {TourGallery} from "@/components/tour/TourGallery";
import type {AppLocale} from "@/constants/locales";
import {Link} from "@/i18n/navigation";
import {
  categoryIcons,
} from "@/components/search/category-icons";
import {
  getCategoryIconColor,
  getCategoryIconKey,
} from "@/components/search/category-filter-icons";
import {TourDetailList} from "@/features/tour-detail/TourDetailList";
import {
  TourDetailSectionCard,
} from "@/features/tour-detail/TourDetailSectionCard";
import {TourDetailSidebar} from "@/features/tour-detail/TourDetailSidebar";
import type {PublicTourDetailFeedbackState, PublicTourDetailProps} from "@/features/tour-detail/tour-detail.types";
import {buildTourImageSet, getTourDetailFlags} from "@/features/tour-detail/tour-detail.utils";
import {
  formatCategoryLabel,
  formatDayLabel,
  formatRegionLabel,
  sortTourDays,
} from "@/utils/tour-labels";
import {radiusTokens} from "@/theme/tokens";

const IconByCategory = {
  aile: categoryIcons.family,
  doga: categoryIcons.nature,
  gunubirlik: categoryIcons.daily,
  konaklamali: categoryIcons.hotel,
  macera: categoryIcons.adventure,
  tarih: categoryIcons.history,
};

export function PublicTourDetail({tour}: PublicTourDetailProps) {
  const locale = useLocale() as AppLocale;
  const tTour = useTranslations("tour");
  const [feedback, setFeedback] = useState<PublicTourDetailFeedbackState>({
    open: false,
    message: "",
    type: "success",
  });

  const imageSet = buildTourImageSet(tour);
  const {hasThingsToBring, hasImportantNotes, thingsToBring, importantNotes, hasFreeChildRule, hasChildRule, pricingRows} = getTourDetailFlags(tour);

  return (
    <Stack spacing={{xs: 3, md: 4}}>
      <Stack
        component={Link}
        href="/"
        prefetch={false}
        direction="row"
        spacing={0.6}
        alignItems="center"
        sx={{
          width: "fit-content",
          minHeight: {xs: 42, md: 42},
          color: "text.secondary",
          fontWeight: 700,
          px: 0.2
        }}
      >
        <ArrowBackRoundedIcon fontSize="small" />
        <Typography variant="body2" sx={{fontWeight: 700}}>
          {tTour("backToTours")}
        </Typography>
      </Stack>

      <Grid2 container spacing={{xs: 2, md: 2.5}}>
        <Grid2 size={{xs: 12, md: 8}}>
          <TourGallery images={imageSet} alt={tour.title} videoUrl={tour.videoUrl} videoUrls={tour.videoUrls} />
        </Grid2>

        <Grid2 size={{xs: 12, md: 4}}>
          <TourDetailSidebar
            tour={tour}
            locale={locale}
            shareTitle={tTour("share")}
            campaignPriceLabel={tTour("campaignPrice")}
            startingFromLabel={tTour("startingFrom")}
            priceOnRequestLabel={tTour("priceOnRequest")}
            transferLabel={tTour("transfer")}
            mealLabel={tTour("meal")}
            includedLabel={tTour("included")}
            notIncludedLabel={tTour("notIncluded")}
            onFeedback={(message, type) => setFeedback({open: true, message, type})}
          />
        </Grid2>
      </Grid2>

      <TourDetailSectionCard title={tour.title}>
        <>
          <Typography color="text.secondary" sx={{fontSize: {xs: 16, md: 17}, lineHeight: 1.72}}>
            {tour.shortDescription}
          </Typography>
          {tour.description ? (
            <Typography color="text.secondary" sx={{lineHeight: 1.8}}>
              {tour.description}
            </Typography>
          ) : null}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tour.categories.map((category) => {
              const iconKey = getCategoryIconKey(category);
              const Icon = IconByCategory[iconKey as keyof typeof IconByCategory];
              const iconColor = getCategoryIconColor(category);

              return (
                <Chip
                  key={category}
                  icon={Icon ? <Icon /> : undefined}
                  variant="filled"
                  label={formatCategoryLabel(category, locale)}
                  sx={{
                    height: 28,
                    borderRadius: `${radiusTokens.sm}px`,
                    bgcolor: iconKey === "gunubirlik" ? "rgba(255,239,221,0.96)" : "rgba(232,244,252,0.96)",
                    color: "#11354A",
                    fontSize: 12,
                    fontWeight: 900,
                    px: 0.45,
                    "& .MuiChip-icon": {
                      width: 15,
                      height: 15,
                      color: iconColor,
                      ml: 0.8,
                      mr: 0.35
                    },
                    "& .MuiChip-label": {
                      px: 0.65
                    }
                  }}
                />
              );
            })}
          </Stack>
        </>
      </TourDetailSectionCard>

      {hasThingsToBring || hasImportantNotes ? (
        <Grid2 container spacing={{xs: 2, md: 2.5}}>
          {hasThingsToBring ? (
            <Grid2 size={{xs: 12, md: 6}}>
              <TourDetailSectionCard title={tTour("thingsToBring")} fullHeight>
                <TourDetailList items={thingsToBring} />
              </TourDetailSectionCard>
            </Grid2>
          ) : null}

          {hasImportantNotes ? (
            <Grid2 size={{xs: 12, md: 6}}>
              <TourDetailSectionCard title={tTour("importantNotes")} fullHeight>
                <TourDetailList items={importantNotes} />
              </TourDetailSectionCard>
            </Grid2>
          ) : null}
        </Grid2>
      ) : null}

      <Grid2 container spacing={{xs: 2, md: 2.5}}>
        <Grid2 size={{xs: 12, md: 7}}>
          <TourDetailSectionCard title={tTour("pricingByRegion")}>
            <Stack spacing={1.3}>
              {pricingRows.map(([region, pricing]) => (
                <Stack
                  key={region}
                  direction={{xs: "column", sm: "row"}}
                  spacing={1}
                  justifyContent="space-between"
                  sx={{
                    p: {xs: 1.15, md: 0.95},
                    borderRadius: `${radiusTokens.sm}px`,
                    bgcolor: "rgba(232,244,252,0.92)",
                    border: "1px solid rgba(206,226,240,0.72)",
                    boxShadow: "none"
                  }}
                >
                  <Stack direction={{xs: "column", md: "row"}} spacing={{xs: 0.8, md: 1.2}} alignItems={{xs: "flex-start", md: "center"}} sx={{minWidth: 0, flex: 1}}>
                    <Stack direction="row" spacing={0.45} alignItems="center" sx={{minWidth: {md: 150}}}>
                      <LocationOnRoundedIcon sx={{fontSize: 16, color: "#00437D"}} />
                      <Typography sx={{fontSize: 13, fontWeight: 900, color: "#0A2D5D"}}>
                        {formatRegionLabel(region, locale)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                      {sortTourDays(pricing.availableDays || []).map((day) => (
                        <Chip
                          key={day}
                          size="small"
                          icon={<CalendarMonthRoundedIcon />}
                          label={formatDayLabel(day, locale)}
                          sx={{
                            height: 24,
                            borderRadius: `${radiusTokens.sm}px`,
                            bgcolor: "rgba(191,218,235,0.88)",
                            color: "#17435E",
                            fontSize: 11,
                            fontWeight: 800,
                            "& .MuiChip-icon": {
                              fontSize: 13,
                              color: "#58758A"
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={{xs: 1.6, md: 2.2}} alignItems="center" sx={{flexShrink: 0, pl: {md: 1}}}>
                    <Typography sx={{fontSize: 12.5, color: "#17435E", fontWeight: 700, whiteSpace: "nowrap"}}>
                      {tTour("adultPrice")}:{" "}
                      <Box component="span" sx={{fontWeight: 900, color: "#00437D"}}>
                      {typeof pricing.adultPrice === "number"
                        ? `${pricing.adultPrice} ${tour.pricing.currency}`
                        : tTour("priceOnRequest")}
                      </Box>
                    </Typography>
                    <Typography sx={{fontSize: 12.5, color: "#17435E", fontWeight: 700, whiteSpace: "nowrap"}}>
                      {tTour("childPrice")}:{" "}
                      <Box component="span" sx={{fontWeight: 900, color: "#00437D"}}>
                      {typeof pricing.childPrice === "number"
                        ? `${pricing.childPrice} ${tour.pricing.currency}`
                        : tTour("priceOnRequest")}
                      </Box>
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </TourDetailSectionCard>
        </Grid2>

        <Grid2 size={{xs: 12, md: 5}}>
          <TourDetailSectionCard title={tTour("participantRules")}>
            <>
              {hasFreeChildRule ? (
                <Chip
                  icon={<PersonRoundedIcon />}
                  label={`${tTour("freeChildAge")}: ${tour.participantRules?.freeChildMinAge}-${tour.participantRules?.freeChildMaxAge}`}
                  sx={{
                    alignSelf: "flex-start",
                    height: 42,
                    px: 0.8,
                    borderRadius: `${radiusTokens.md}px`,
                    bgcolor: "rgba(255,239,221,0.96)",
                    color: "#11354A",
                    fontWeight: 900,
                    "& .MuiChip-icon": {color: "#00437D", fontSize: 18}
                  }}
                />
              ) : null}
              {hasChildRule ? (
                <Chip
                  icon={<PersonRoundedIcon />}
                  label={`${tTour("childAge")}: ${tour.participantRules?.childMinAge}-${tour.participantRules?.childMaxAge}`}
                  sx={{
                    alignSelf: "flex-start",
                    height: 42,
                    px: 0.8,
                    borderRadius: `${radiusTokens.md}px`,
                    bgcolor: "rgba(255,239,221,0.96)",
                    color: "#11354A",
                    fontWeight: 900,
                    "& .MuiChip-icon": {color: "#00437D", fontSize: 18}
                  }}
                />
              ) : null}
              {!hasFreeChildRule && !hasChildRule ? (
                <Typography color="text.secondary">
                  {tTour("participantRulesNotSpecified")}
                </Typography>
              ) : null}
            </>
          </TourDetailSectionCard>
        </Grid2>
      </Grid2>

      <FeedbackSnackbar
        open={feedback.open}
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback((prev) => ({...prev, open: false}))}
      />
    </Stack>
  );
}
