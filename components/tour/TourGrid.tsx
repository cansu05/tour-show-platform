import {Grid2} from '@mui/material';
import type {Tour} from '@/types/tour';
import {TourCard} from '@/components/tour/TourCard';
import type {AppLocale} from '@/constants/locales';

type Props = {
  tours: Tour[];
  locale: AppLocale;
};

export function TourGrid({tours, locale}: Props) {
  return (
    <Grid2 container spacing={{xs: 2, md: 2.5, lg: 3}}>
      {tours.map((tour) => (
        <Grid2 key={tour.id} size={{xs: 12, sm: 6, md: 6, xl: 4}}>
          <TourCard tour={tour} locale={locale} />
        </Grid2>
      ))}
    </Grid2>
  );
}
