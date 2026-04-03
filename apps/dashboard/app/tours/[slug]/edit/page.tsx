import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {notFound} from 'next/navigation';
import {DashboardShell} from '@/features/dashboard/DashboardShell';
import {TourDashboardForm} from '@/features/dashboard/TourDashboardForm';
import {buildDashboardFormFromTour} from '@/features/dashboard/tour-form-data';
import {buttonClassName, Pill} from '@/features/dashboard/components/admin-ui';
import {LoadingLink} from '@/features/dashboard/components/LoadingLink';
import {getTourBySlug} from '@/services/tour.service';

export const dynamic = 'force-dynamic';

export default async function EditTourPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  return (
    <DashboardShell
      eyebrow="Düzenleme Akışı"
      title={tour.title}
      description="İçeriği bölüm bazında düzenle, eksikleri tamamla ve yayın durumunu kontrollü şekilde yönet."
      actions={
        <LoadingLink href="/tours" loadingLabel="Liste açılıyor..." className={buttonClassName({variant: 'secondary'})}>
          <ArrowBackRoundedIcon sx={{fontSize: 18}} />
          Tur listesine dön
        </LoadingLink>
      }
      meta={
        <>
          <Pill>Slug: /{tour.slug}</Pill>
          <Pill>Son güncelleme akışta korunur</Pill>
        </>
      }
    >
      <TourDashboardForm mode="edit" originalSlug={slug} initialData={buildDashboardFormFromTour(tour)} />
    </DashboardShell>
  );
}
