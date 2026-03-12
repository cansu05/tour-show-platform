'use client';

import {Button, Stack, Typography} from '@mui/material';
import {useTranslations} from 'next-intl';

export default function LocaleError({reset}: {error: Error; reset: () => void}) {
  const tCommon = useTranslations('common');

  return (
    <Stack spacing={2} alignItems="center" sx={{py: 8}}>
      <Typography variant="h4">{tCommon('tourLoadError')}</Typography>
      <Button variant="contained" onClick={reset}>
        {tCommon('retry')}
      </Button>
    </Stack>
  );
}
