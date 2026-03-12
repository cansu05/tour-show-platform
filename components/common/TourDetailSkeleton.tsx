import {Box, Skeleton, Stack} from '@mui/material';

export function TourDetailSkeleton() {
  return (
    <Stack spacing={2.5}>
      <Skeleton variant="rounded" height={320} />
      <Skeleton variant="text" width="45%" height={46} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="82%" />
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" width={120} height={44} />
        <Skeleton variant="rounded" width={120} height={44} />
        <Skeleton variant="rounded" width={120} height={44} />
      </Stack>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <Skeleton variant="rounded" height={160} />
        <Skeleton variant="rounded" height={160} />
      </Box>
    </Stack>
  );
}

