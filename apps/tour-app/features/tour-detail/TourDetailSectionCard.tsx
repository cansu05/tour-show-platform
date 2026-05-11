import {Box, Paper, Stack, Typography} from '@mui/material';
import type {TourDetailSectionCardProps} from '@/features/tour-detail/tour-detail.types';
import {radiusTokens} from '@/theme/tokens';

export function TourDetailSectionCard({
  title,
  children,
  fullHeight = false
}: TourDetailSectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {xs: 2.4, md: 2.75},
        height: fullHeight ? '100%' : undefined,
        borderRadius: `${radiusTokens.lg}px`,
        bgcolor: '#FFFFFF',
        boxShadow: '0 14px 34px rgba(8, 48, 78, 0.07)',
        border: '1px solid rgba(226, 234, 242, 0.55)'
      }}
    >
      <Stack spacing={1.25}>
        <Stack spacing={0.7} alignItems="flex-start">
          <Typography
            variant="h3"
            sx={{
              color: '#001F33',
              fontSize: {xs: 22, md: 25},
              lineHeight: 1.18,
              fontWeight: 900,
              letterSpacing: 0
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 42,
              height: 3,
              borderRadius: 999,
              bgcolor: '#FF7800'
            }}
          />
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}
