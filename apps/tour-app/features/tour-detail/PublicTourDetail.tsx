"use client";

import {useState} from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import {Chip, Grid2, Stack, Typography} from "@mui/material";
import {useLocale, useTranslations} from "next-intl";
import {FeedbackSnackbar} from "@/components/common/FeedbackSnackbar";
import {TourGallery} from "@/components/tour/TourGallery";
import type {AppLocale} from "@/constants/locales";
import {Link} from "@/i18n/navigation";
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
        sx={{width: "fit-content", color: "text.secondary", fontWeight: 700, px: 0.2}}
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
            {tour.categories.map((category) => (
              <Chip
                key={category}
                variant="filled"
                label={formatCategoryLabel(category, locale)}
                sx={{bgcolor: "rgba(5,63,92,0.12)", color: "text.primary", fontWeight: 700}}
              />
            ))}
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
                  sx={{p: 1.5, borderRadius: 2, bgcolor: "rgba(236,246,251,0.7)"}}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h4">{formatRegionLabel(region, locale)}</Typography>
                    <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                      {sortTourDays(pricing.availableDays || []).map((day) => (
                        <Chip
                          key={day}
                          size="small"
                          icon={<EventAvailableRoundedIcon />}
                          label={formatDayLabel(day, locale)}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Stack spacing={0.35}>
                    <Typography color="text.secondary">
                      {tTour("adultPrice")}:{" "}
                      {typeof pricing.adultPrice === "number"
                        ? `${pricing.adultPrice} ${tour.pricing.currency}`
                        : tTour("priceOnRequest")}
                    </Typography>
                    <Typography color="text.secondary">
                      {tTour("childPrice")}:{" "}
                      {typeof pricing.childPrice === "number"
                        ? `${pricing.childPrice} ${tour.pricing.currency}`
                        : tTour("priceOnRequest")}
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
                  icon={<LocalOfferRoundedIcon />}
                  label={`${tTour("freeChildAge")}: ${tour.participantRules?.freeChildMinAge}-${tour.participantRules?.freeChildMaxAge}`}
                  sx={{alignSelf: "flex-start"}}
                />
              ) : null}
              {hasChildRule ? (
                <Chip
                  icon={<LocalOfferRoundedIcon />}
                  label={`${tTour("childAge")}: ${tour.participantRules?.childMinAge}-${tour.participantRules?.childMaxAge}`}
                  sx={{alignSelf: "flex-start"}}
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
