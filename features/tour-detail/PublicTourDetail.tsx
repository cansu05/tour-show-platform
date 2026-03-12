'use client';

import {useMemo, useState} from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {Chip, Grid2, Paper, Stack, Typography} from '@mui/material';
import {useLocale, useTranslations} from 'next-intl';
import {TourGallery} from '@/components/tour/TourGallery';
import {FeedbackSnackbar} from '@/components/common/FeedbackSnackbar';
import {ShareActions} from '@/features/sharing/SharePanel';
import {Link} from '@/i18n/navigation';
import type {Tour} from '@/types/tour';
import type {AppLocale} from '@/constants/locales';
import {toCategoryLabelKey} from '@/utils/category-label';

type Props = {
  tour: Tour;
};

export function PublicTourDetail({tour}: Props) {
  const locale = useLocale() as AppLocale;
  const tTour = useTranslations('tour');
  const tHome = useTranslations('home');
  const [feedback, setFeedback] = useState<{open: boolean; message: string; type: 'success' | 'error'}>({
    open: false,
    message: '',
    type: 'success'
  });

  const categoryLabels = {
    aile: tHome('categoryLabels.aile'),
    doga: tHome('categoryLabels.doga'),
    deniz: tHome('categoryLabels.deniz'),
    tarih: tHome('categoryLabels.tarih'),
    macera: tHome('categoryLabels.macera'),
    gunubirlik: tHome('categoryLabels.gunubirlik'),
    konaklamali: tHome('categoryLabels.konaklamali')
  };

  const imageSet = useMemo(() => {
    const merged = [tour.coverImage, ...tour.gallery].filter(Boolean);
    return Array.from(new Set(merged));
  }, [tour.coverImage, tour.gallery]);

  return (
    <Stack spacing={{xs: 3, md: 4}}>
      <Stack
        component={Link}
        href="/"
        prefetch={false}
        direction="row"
        spacing={0.6}
        alignItems="center"
        sx={{width: 'fit-content', color: 'text.secondary', fontWeight: 700, px: 0.2}}
      >
        <ArrowBackRoundedIcon fontSize="small" />
        <Typography variant="body2" sx={{fontWeight: 700}}>
          {tTour('backToTours')}
        </Typography>
      </Stack>

      <Grid2 container spacing={{xs: 2, md: 2.5}}>
        <Grid2 size={{xs: 12, md: 8}}>
          <TourGallery images={imageSet} alt={tour.title} />
        </Grid2>

        <Grid2 size={{xs: 12, md: 4}}>
          <Stack spacing={2.25} sx={{position: {md: 'sticky'}, top: {md: 20}}}>
            <Paper
              elevation={0}
              sx={{
                p: {xs: 2.4, md: 2.8},
                borderRadius: 2.25,
                background: 'linear-gradient(165deg, #053F5C 0%, #429EBD 100%)',
                color: 'common.white',
                boxShadow: '0 12px 28px rgba(5,63,92,0.2)'
              }}
            >
              <Stack spacing={1.2}>
                <Typography variant="h4" sx={{color: 'rgba(255,255,255,0.78)'}}>
                  {tTour('price')}
                </Typography>
                <Typography variant="h2" sx={{color: 'inherit'}}>
                  {tour.priceText || tTour('priceOnRequest')}
                </Typography>
                {tour.duration ? (
                  <Chip
                    label={`${tTour('duration')}: ${tour.duration}`}
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: 'rgba(255,255,255,0.16)',
                      color: 'common.white'
                    }}
                  />
                ) : null}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: {xs: 2.4, md: 2.8},
                borderRadius: 2.25,
                bgcolor: 'background.paper',
                boxShadow: '0 10px 24px rgba(5,63,92,0.08)'
              }}
            >
              <Stack spacing={1.4}>
                <Typography variant="h3">{tTour('share')}</Typography>
                <ShareActions
                  slug={tour.slug}
                  title={tour.title}
                  locale={locale}
                  onFeedback={(message, type) => setFeedback({open: true, message, type})}
                />
              </Stack>
            </Paper>
          </Stack>
        </Grid2>
      </Grid2>

      <Paper
        elevation={0}
        sx={{
          p: {xs: 2.3, md: 2.9},
          borderRadius: 2.25,
          background: '#FFFFFF',
          boxShadow: '0 12px 24px rgba(5,63,92,0.1)'
        }}
      >
        <Stack spacing={1.6}>
          <Typography variant="h2">{tour.title}</Typography>
          <Typography color="text.secondary" sx={{fontSize: {xs: 16, md: 17}, lineHeight: 1.72}}>
            {tour.shortDescription}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tour.categories.map((category) => {
              const key = toCategoryLabelKey(category);
              return (
                <Chip
                  key={category}
                  variant="filled"
                  label={key ? categoryLabels[key] : category}
                  sx={{bgcolor: 'rgba(5,63,92,0.12)', color: 'text.primary', fontWeight: 700}}
                />
              );
            })}
          </Stack>
        </Stack>
      </Paper>

      <Grid2 container spacing={{xs: 2, md: 2.5}}>
        <Grid2 size={{xs: 12, md: 6}}>
          <Paper
            elevation={0}
            sx={{
              p: {xs: 2.3, md: 2.9},
              height: '100%',
              borderRadius: 2.25,
              bgcolor: '#FFFFFF',
              boxShadow: '0 10px 22px rgba(5,63,92,0.1)'
            }}
          >
            <Stack spacing={1.2}>
              <Typography variant="h3">{tTour('highlights')}</Typography>
              <Stack component="ul" spacing={0.85} sx={{pl: 2.4, m: 0}}>
                {tour.highlights.map((item) => (
                  <Typography component="li" key={item} color="text.secondary" sx={{lineHeight: 1.62}}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={{xs: 12, md: 6}}>
          <Paper
            elevation={0}
            sx={{
              p: {xs: 2.3, md: 2.9},
              height: '100%',
              borderRadius: 2.25,
              bgcolor: '#FFFFFF',
              boxShadow: '0 10px 22px rgba(5,63,92,0.1)'
            }}
          >
            <Stack spacing={1.2}>
              <Typography variant="h3">{tTour('includedServices')}</Typography>
              <Stack component="ul" spacing={0.85} sx={{pl: 2.4, m: 0}}>
                {tour.includedServices.map((item) => (
                  <Typography component="li" key={item} color="text.secondary" sx={{lineHeight: 1.62}}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Paper>
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
