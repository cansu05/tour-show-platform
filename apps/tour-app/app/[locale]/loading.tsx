import {Box, Grid2, Paper, Skeleton, Stack} from '@mui/material';
import {TourCardSkeleton} from '@/components/common/TourCardSkeleton';
import {radiusTokens} from '@/theme/tokens';

export default function LocaleLoading() {
  return (
    <Stack spacing={{xs: 2, md: 2.2}}>
      <Box sx={{position: 'relative', pb: {xs: 28, sm: 18, md: 12.8}}}>
        <Box
          component="section"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: `${radiusTokens.lg}px`,
            minHeight: {xs: 470, sm: 450, md: 410},
            px: {xs: 2, sm: 4, md: 8},
            pt: {xs: 5.7, md: 6.2},
            pb: {xs: 17.5, md: 14},
            bgcolor: '#EAF3FA',
            boxShadow: '0 18px 44px rgba(26,86,130,0.1)'
          }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              position: 'absolute',
              inset: 0,
              transform: 'none',
              borderRadius: `${radiusTokens.lg}px`,
              bgcolor: 'rgba(219,231,241,0.82)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.54) 36%, rgba(255,255,255,0.18) 72%)'
            }}
          />

          <Stack spacing={1.6} sx={{position: 'relative', zIndex: 1, width: {xs: '100%', md: 500}, maxWidth: {xs: 330, md: 500}}}>
            <Stack spacing={0.8}>
              <Skeleton variant="text" width="86%" height={58} animation="wave" />
              <Skeleton variant="text" width="76%" height={58} animation="wave" />
            </Stack>
            <Stack spacing={0.45}>
              <Skeleton variant="text" width="68%" height={20} animation="wave" />
              <Skeleton variant="text" width="54%" height={20} animation="wave" />
            </Stack>
            <Stack direction="row" gap={0.9} flexWrap="wrap" sx={{pt: 0.4, maxWidth: 450}}>
              {Array.from({length: 3}).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={index === 1 ? 128 : 112}
                  height={40}
                  animation="wave"
                  sx={{borderRadius: `${radiusTokens.lg}px`}}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        <Stack
          spacing={1.55}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: {xs: 0, md: -8},
            zIndex: 3,
            width: '100%',
            alignItems: 'center',
            px: {xs: 0.6, md: 0}
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: {xs: 'calc(100% - 12px)', md: 'min(1100px, calc(100% - 32px))'},
              mx: 'auto',
              px: {xs: 0.8, md: 1.55},
              py: {xs: 0.95, md: 1.35},
              borderRadius: `${radiusTokens.lg}px`,
              background: '#FFFFFF'
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.2}>
              <Skeleton
                variant="rounded"
                height={44}
                animation="wave"
                sx={{flex: 1, borderRadius: `${radiusTokens.sm}px`}}
              />
              <Skeleton
                variant="rounded"
                width={132}
                height={52}
                animation="wave"
                sx={{borderRadius: `${radiusTokens.md}px`}}
              />
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.8} sx={{pt: {xs: 0.8, md: 1}, px: {xs: 0.1, md: 0.8}}}>
              <Skeleton variant="text" width={92} height={18} animation="wave" />
              <Box sx={{display: 'flex', gap: 1, overflow: 'hidden'}}>
                {Array.from({length: 5}).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width={index === 4 ? 112 : 78}
                    height={22}
                    animation="wave"
                    sx={{borderRadius: `${radiusTokens.md}px`, flexShrink: 0}}
                  />
                ))}
              </Box>
            </Stack>
          </Paper>

          <Stack
            direction="row"
            justifyContent={{xs: 'flex-start', md: 'center'}}
            gap={1.6}
            sx={{
              width: '100%',
              maxWidth: 1220,
              overflow: 'hidden',
              py: 0.2,
              px: {xs: 0.6, md: 0}
            }}
          >
            {Array.from({length: 7}).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={index === 0 ? 118 : 128}
                height={42}
                animation="wave"
                sx={{borderRadius: `${radiusTokens.lg}px`, flexShrink: 0}}
              />
            ))}
          </Stack>
        </Stack>
      </Box>

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
