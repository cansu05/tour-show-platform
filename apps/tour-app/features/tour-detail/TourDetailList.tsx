import {Stack, Typography} from '@mui/material';
import type {TourDetailListProps} from '@/features/tour-detail/tour-detail.types';

export function TourDetailList({items}: TourDetailListProps) {
  return (
    <Stack component="ul" spacing={0.85} sx={{pl: 2.4, m: 0}}>
      {items.map((item) => (
        <Typography component="li" key={item} color="text.secondary" sx={{lineHeight: 1.62}}>
          {item}
        </Typography>
      ))}
    </Stack>
  );
}
