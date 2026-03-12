'use client';

import {Box, Chip, Stack, Typography} from '@mui/material';
import {TOUR_CATEGORIES} from '@/constants/categories';
import {useTranslations} from 'next-intl';
import {toCategoryLabelKey} from '@/utils/category-label';

type Props = {
  value: string | null;
  onChange: (category: string | null) => void;
};

export function CategoryFilters({value, onChange}: Props) {
  const t = useTranslations('home');

  const categoryLabels = {
    aile: t('categoryLabels.aile'),
    doga: t('categoryLabels.doga'),
    deniz: t('categoryLabels.deniz'),
    tarih: t('categoryLabels.tarih'),
    macera: t('categoryLabels.macera'),
    gunubirlik: t('categoryLabels.gunubirlik'),
    konaklamali: t('categoryLabels.konaklamali')
  };

  return (
    <Stack spacing={1.15}>
      <Typography variant="h4" sx={{color: 'text.secondary'}}>
        {t('categories')}
      </Typography>
      <Box
        sx={{
          p: 0.6,
          borderRadius: 3,
          bgcolor: 'rgba(236,246,251,0.92)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.55)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {display: 'none'}
        }}
      >
        <Stack direction="row" gap={1} sx={{width: 'max-content', minWidth: '100%'}}>
          <Chip
            label={t('allCategories')}
            clickable
            color={value === null ? 'primary' : 'default'}
            variant="filled"
            sx={{
              px: 1.2,
              bgcolor: value === null ? 'primary.main' : 'rgba(255,255,255,0.9)'
            }}
            onClick={() => onChange(null)}
          />
          {TOUR_CATEGORIES.map((category) => {
            const key = toCategoryLabelKey(category);

            return (
              <Chip
                key={category}
                label={key ? categoryLabels[key] : category}
                clickable
                color={value === category ? 'primary' : 'default'}
                variant="filled"
                sx={{
                  px: 1.2,
                  bgcolor: value === category ? 'primary.main' : 'rgba(255,255,255,0.9)'
                }}
                onClick={() => onChange(category)}
              />
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
