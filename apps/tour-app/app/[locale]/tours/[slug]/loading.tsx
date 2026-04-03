import {Stack} from '@mui/material';
import {TourDetailSkeleton} from '@/components/common/TourDetailSkeleton';

export default function TourLoading() {
  return (
    <Stack spacing={3}>
      <TourDetailSkeleton />
    </Stack>
  );
}

