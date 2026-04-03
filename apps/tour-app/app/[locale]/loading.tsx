import {Search, Mic} from '@mui/icons-material';
import {Box, Chip, Grid2, InputAdornment, Stack, TextField, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import {TourCardSkeleton} from '@/components/common/TourCardSkeleton';

export default async function LocaleLoading() {
  const tHome = await getTranslations('home');

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h2">{tHome('title')}</Typography>
        <Typography color="text.secondary">{tHome('subtitle')}</Typography>
      </Box>

      <TextField
        fullWidth
        disabled
        placeholder={tHome('searchPlaceholder')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Mic color="action" />
            </InputAdornment>
          )
        }}
      />

      <Stack spacing={1.2}>
        <Typography variant="h6">{tHome('categories')}</Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {Array.from({length: 7}).map((_, index) => (
            <Chip key={index} label=" " sx={{minWidth: 80}} />
          ))}
        </Stack>
      </Stack>

      <Grid2 container spacing={2.5}>
        {Array.from({length: 6}).map((_, index) => (
          <Grid2 key={index} size={{xs: 12, sm: 6, lg: 6, xl: 4}}>
            <TourCardSkeleton />
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}
