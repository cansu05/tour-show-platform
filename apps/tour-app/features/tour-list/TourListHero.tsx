import {Box, Stack, Typography} from '@mui/material';
import type {TourListHeroProps} from '@/features/tour-list/tour-list.types';

export function TourListHero({title, subtitle}: TourListHeroProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2.5,
        px: {xs: 2.5, md: 4},
        py: {xs: 2.5, md: 3.5},
        background:
          'linear-gradient(150deg, rgba(5,63,92,0.96) 0%, rgba(66,158,189,0.88) 52%, rgba(159,231,245,0.94) 100%)',
        boxShadow: '0 16px 34px rgba(5,63,92,0.18)',
        color: 'common.white',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 340,
          height: 340,
          right: -96,
          top: -160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,173,25,0.3) 0%, rgba(247,173,25,0) 72%)'
        }
      }}
    >
      <Stack spacing={1} maxWidth={700} sx={{position: 'relative', zIndex: 1, mx: 'auto', textAlign: 'center', alignItems: 'center'}}>
        <Typography variant="h1" sx={{color: 'inherit'}}>
          {title}
        </Typography>
        <Typography sx={{fontSize: {xs: 17, md: 20}, color: 'rgba(255,255,255,0.92)', maxWidth: 580, width: '100%', mx: 'auto', textAlign: 'center'}}>
          {subtitle}
        </Typography>
      </Stack>
    </Box>
  );
}
