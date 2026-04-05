import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {DashboardShell} from '@/features/dashboard/DashboardShell';
import {TourDashboardForm} from '@/features/dashboard/TourDashboardForm';
import {buildDuplicateTourForm} from '@/features/dashboard/tour-form-data';
import {buttonClassName, Pill} from '@/features/dashboard/components/admin-ui';
import {LoadingLink} from '@/features/dashboard/components/LoadingLink';
import {getTourBySlug} from '@/services/tour.service';

export default async function NewTourPage({searchParams}: {searchParams?: Promise<{duplicate?: string}>}) {
  const params = searchParams ? await searchParams : undefined;
  const duplicatedFrom = params?.duplicate ? await getTourBySlug(params.duplicate).catch(() => null) : null;

  return (
    <DashboardShell
      eyebrow="Yeni İçerik Akışı"
      title={duplicatedFrom ? 'Kopyadan yeni tur oluştur' : 'Yeni tur oluştur'}
      description="Uzun ve dağınık form yerine bölümlenmiş bir içerik üretim deneyimi kullan. Sol tarafta akışı takip et, sağ tarafta aktif bölüm üzerinde çalış."
      actions={
        <LoadingLink href="/tours" loadingLabel="Liste açılıyor..." className={buttonClassName({variant: 'secondary'})}>
          <ArrowBackRoundedIcon sx={{fontSize: 18}} />
          Tur listesine dön
        </LoadingLink>
      }
      meta={
        <>
          <Pill>Bölümlenmiş form</Pill>
          <Pill>Taslak, önizleme ve yayın akışı</Pill>
        </>
      }
    >
      <TourDashboardForm initialData={duplicatedFrom ? buildDuplicateTourForm(duplicatedFrom) : undefined} />
    </DashboardShell>
  );
}

