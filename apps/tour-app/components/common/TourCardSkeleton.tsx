import {Card, CardContent, Skeleton, Stack} from '@mui/material';
import {radiusTokens} from '@/theme/tokens';

export function TourCardSkeleton() {
  return (
    <Card sx={{borderRadius: `${radiusTokens.lg}px`, overflow: 'hidden'}}>
      <Skeleton variant="rectangular" height={220} />
      <CardContent sx={{p: 2.25}}>
        <Stack spacing={1.2}>
          <Skeleton variant="text" width="68%" height={40} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="rounded" width={110} height={30} />
        </Stack>
      </CardContent>
    </Card>
  );
}
