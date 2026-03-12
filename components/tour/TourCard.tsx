'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import {Box, Card, CardActionArea, CardContent, Chip, Stack, Typography} from '@mui/material';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import type {Tour} from '@/types/tour';
import {Link} from '@/i18n/navigation';
import type {AppLocale} from '@/constants/locales';
import {toCategoryLabelKey} from '@/utils/category-label';

type Props = {
  tour: Tour;
  locale: AppLocale;
};

export function TourCard({tour, locale}: Props) {
  const tTour = useTranslations('tour');
  const tHome = useTranslations('home');

  const categoryMap = {
    aile: tHome('categoryLabels.aile'),
    doga: tHome('categoryLabels.doga'),
    deniz: tHome('categoryLabels.deniz'),
    tarih: tHome('categoryLabels.tarih'),
    macera: tHome('categoryLabels.macera'),
    gunubirlik: tHome('categoryLabels.gunubirlik'),
    konaklamali: tHome('categoryLabels.konaklamali')
  };

  const primaryCategory = tour.categories[0];
  const categoryKey = primaryCategory ? toCategoryLabelKey(primaryCategory) : null;
  const categoryLabel = categoryKey ? categoryMap[categoryKey] : primaryCategory;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        overflow: 'hidden',
        background: '#FFFFFF',
        transition: 'transform 0.24s ease, box-shadow 0.24s ease',
        boxShadow: '0 10px 24px rgba(5,63,92,0.12)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 18px 36px rgba(5,63,92,0.2)'
        }
      }}
    >
      <CardActionArea
        component={Link}
        href={`/tours/${tour.slug}`}
        locale={locale}
        prefetch={false}
        sx={{height: '100%', alignItems: 'stretch'}}
      >
        <Stack sx={{height: '100%'}}>
          <Box sx={{position: 'relative', minHeight: 248}}>
            <Image
              src={tour.coverImage}
              alt={tour.title}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 1536px) 50vw, 33vw"
              style={{objectFit: 'cover'}}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(5,38,58,0.02) 35%, rgba(5,38,58,0.62) 100%)'
              }}
            />
            {categoryLabel ? (
              <Chip
                label={categoryLabel}
                sx={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  px: 1,
                  color: 'common.white',
                  bgcolor: 'rgba(5,63,92,0.82)'
                }}
              />
            ) : null}
            <Stack direction="row" gap={0.8} sx={{position: 'absolute', bottom: 14, left: 14, right: 14, flexWrap: 'wrap'}}>
              {tour.duration ? (
                <Chip
                  size="small"
                  icon={<AccessTimeIcon sx={{fontSize: 18}} />}
                  label={tour.duration}
                  sx={{bgcolor: 'rgba(255,255,255,0.92)'}}
                />
              ) : null}
              <Chip
                size="small"
                icon={<LocalOfferIcon sx={{fontSize: 18}} />}
                label={tour.priceText || tTour('priceOnRequest')}
                sx={{bgcolor: 'rgba(255,255,255,0.92)'}}
              />
            </Stack>
          </Box>

          <CardContent
            sx={{
              p: 2.35,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              bgcolor: 'rgba(236,246,251,0.45)'
            }}
          >
            <Stack spacing={1.1} sx={{flex: 1}}>
              <Typography variant="h3" sx={{lineHeight: 1.22}}>
                {tour.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.62, minHeight: 72}}>
                {tour.shortDescription}
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" pt={0.8}>
                <Stack spacing={0.1}>
                  <Typography variant="caption" color="text.secondary" sx={{fontSize: 12.5}}>
                    {tTour('price')}
                  </Typography>
                  <Typography variant="h4" color="secondary.main">
                    {tour.priceText || tTour('priceOnRequest')}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.35}
                  alignItems="center"
                  sx={{
                    px: 1.35,
                    minHeight: 40,
                    borderRadius: 999,
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    fontWeight: 700
                  }}
                >
                  <Typography variant="body2" sx={{fontWeight: 700}}>
                    {tTour('publicPage')}
                  </Typography>
                  <ArrowOutwardRoundedIcon sx={{fontSize: 18}} />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
