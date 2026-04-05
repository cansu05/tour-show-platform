import {Paper, Stack, Typography} from '@mui/material';
import type {TourDetailSectionCardProps} from '@/features/tour-detail/tour-detail.types';

export function TourDetailSectionCard({
  title,
  children,
  fullHeight = false
}: TourDetailSectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {xs: 2.3, md: 2.9},
        height: fullHeight ? '100%' : undefined,
        borderRadius: 2.25,
        bgcolor: '#FFFFFF',
        boxShadow: '0 10px 22px rgba(5,63,92,0.1)'
      }}
    >
      <Stack spacing={1.2}>
        <Typography variant="h3">{title}</Typography>
        {children}
      </Stack>
    </Paper>
  );
}
