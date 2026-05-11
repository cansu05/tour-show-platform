'use client';

import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import {Grid2, Paper, Stack, Typography} from '@mui/material';
import {ShareActions} from '@/features/sharing/SharePanel';
import type {TourDetailSidebarProps, TourMetaItemProps} from '@/features/tour-detail/tour-detail.types';
import {radiusTokens} from '@/theme/tokens';

function TourMetaItem({label, value, icon}: TourMetaItemProps) {
  return (
    <Stack
      spacing={0.55}
      sx={{
        minHeight: 84,
        p: 1.4,
        borderRadius: `${radiusTokens.lg}px`,
        bgcolor: 'rgba(236,246,251,0.85)',
        border: '1px solid rgba(5,63,92,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      {icon}
      <Typography variant="caption" sx={{color: 'text.secondary', fontWeight: 700}}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{fontWeight: 800, fontSize: 18, color: 'text.primary'}}>
        {value}
      </Typography>
    </Stack>
  );
}

export function TourDetailSidebar({
  tour,
  locale,
  shareTitle,
  campaignPriceLabel,
  startingFromLabel,
  priceOnRequestLabel,
  transferLabel,
  mealLabel,
  includedLabel,
  notIncludedLabel,
  onFeedback
}: TourDetailSidebarProps) {
  return (
    <Stack spacing={2.25} sx={{position: {md: 'sticky'}, top: {md: 20}}}>
      <Paper
        elevation={0}
        sx={{
          p: {xs: 2.4, md: 2.8},
          borderRadius: `${radiusTokens.lg}px`,
          bgcolor: '#FFFFFF',
          color: 'text.primary',
          boxShadow: '0 14px 30px rgba(5,63,92,0.1)',
          border: '1px solid rgba(5,63,92,0.08)'
        }}
      >
        <Stack spacing={1.15}>
          {typeof tour.campaignPrice === 'number' ? (
            <>
              <Typography variant="overline" sx={{letterSpacing: 1.1, fontWeight: 800, color: 'text.secondary'}}>
                {campaignPriceLabel}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
                <Stack direction="row" alignItems="baseline" spacing={0.9}>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontSize: {xs: 24, md: 28},
                      lineHeight: 1,
                      fontWeight: 900,
                      letterSpacing: -1
                    }}
                  >
                    {tour.priceText || priceOnRequestLabel}
                  </Typography>
                  <Typography sx={{color: 'text.secondary', fontSize: 13, fontWeight: 700}}>
                    {startingFromLabel}
                  </Typography>
                </Stack>
              </Stack>
            </>
          ) : null}

          <Grid2 container spacing={1.1}>
            <Grid2 size={{xs: 6}}>
              <TourMetaItem
                label={transferLabel}
                value={tour.hasTransfer ? includedLabel : notIncludedLabel}
                icon={<DirectionsBusRoundedIcon sx={{fontSize: 20, color: 'primary.main'}} />}
              />
            </Grid2>
            <Grid2 size={{xs: 6}}>
              <TourMetaItem
                label={mealLabel}
                value={tour.hasMeal ? includedLabel : notIncludedLabel}
                icon={<RestaurantRoundedIcon sx={{fontSize: 20, color: 'primary.main'}} />}
              />
            </Grid2>
          </Grid2>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: {xs: 2.4, md: 2.8},
          borderRadius: `${radiusTokens.lg}px`,
          bgcolor: 'background.paper',
          boxShadow: '0 10px 24px rgba(5,63,92,0.08)'
        }}
      >
        <Stack spacing={1.4}>
          <Typography variant="h3">{shareTitle}</Typography>
          <ShareActions slug={tour.slug} title={tour.title} locale={locale} onFeedback={onFeedback} />
        </Stack>
      </Paper>
    </Stack>
  );
}
