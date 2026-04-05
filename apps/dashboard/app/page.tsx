import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLateRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import TourRoundedIcon from '@mui/icons-material/TourRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import {DashboardShell} from '@/features/dashboard/DashboardShell';
import {formatDateTime, getDashboardOverview} from '@/features/dashboard/admin-data';
import {buttonClassName, Pill, SectionCard, StatCard, StatusBadge} from '@/features/dashboard/components/admin-ui';
import {LoadingLink} from '@/features/dashboard/components/LoadingLink';
import {getAllTours} from '@/services/tour.service';

export const dynamic = 'force-dynamic';

export default async function DashboardHomePage() {
  const tours = await getAllTours().catch(() => []);
  const overview = getDashboardOverview(tours);

  return (
    <DashboardShell
      eyebrow="Genel Bakış"
      title="Dashboard"
      description="Durum özeti"
      actions={
        <>
          <LoadingLink href="/tours" loadingLabel="Liste açılıyor..." className={buttonClassName({variant: 'secondary'})}>
            Tüm turlar
          </LoadingLink>
          <LoadingLink href="/tours/new" loadingLabel="Form açılıyor..." className="inline-flex items-center gap-2 rounded-full border border-line bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-3 text-sm font-semibold text-ink transition hover:border-line-strong hover:bg-white hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)]">
            <AddRoundedIcon sx={{fontSize: 18}} />
            Yeni Tur Ekle
          </LoadingLink>
        </>
      }
      meta={
        <>
          <Pill>Toplam {overview.totals.total} tur</Pill>
          <Pill>Son güncelleme {formatDateTime(overview.lastUpdatedAt)}</Pill>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam tur" value={overview.totals.total} icon={<TourRoundedIcon sx={{fontSize: 22}} />} meta="Kayıt sayısı" />
        <StatCard label="Aktif tur" value={overview.totals.active} icon={<LayersRoundedIcon sx={{fontSize: 22}} />} meta="Yayında" tone="brand" />
        <StatCard label="Taslak / dikkat" value={overview.totals.draft} icon={<AssignmentLateRoundedIcon sx={{fontSize: 22}} />} meta="Kontrol bekliyor" tone="warning" />
        <StatCard label="Bu hafta güncellenen" value={overview.totals.updatedThisWeek} icon={<UpdateRoundedIcon sx={{fontSize: 22}} />} meta="Son 7 gün" />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Hızlı İşlemler" description="">
          <div className="grid gap-3 lg:grid-cols-3">
            <LoadingLink href="/tours/new" loadingLabel="Form açılıyor..." className="rounded-[24px] border border-line bg-[linear-gradient(180deg,#ffffff,var(--brand-soft))] p-5 transition hover:border-brand/25 hover:shadow-[0_18px_32px_rgba(79,70,229,0.12)]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[18px] bg-brand-soft text-brand-strong"><AddRoundedIcon sx={{fontSize: 20}} /></div>
              <h3 className="text-base font-semibold text-ink">Yeni Tur</h3>
            </LoadingLink>
            <LoadingLink href="/tours" loadingLabel="Liste açılıyor..." className="rounded-[24px] border border-line bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 transition hover:border-line-strong hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[18px] bg-panel-strong text-ink-soft"><LayersRoundedIcon sx={{fontSize: 20}} /></div>
              <h3 className="text-base font-semibold text-ink">Tur Listesi</h3>
            </LoadingLink>
            <div className="rounded-[24px] border border-line bg-[linear-gradient(180deg,#ffffff,#f9fafb)] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[18px] bg-warning-soft text-warning-strong"><ScheduleRoundedIcon sx={{fontSize: 20}} /></div>
              <h3 className="text-base font-semibold text-ink">Kontrol</h3>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Durum Kartları" description="">
          <div className="space-y-3">
            <div className="rounded-[22px] border border-line bg-panel-subtle p-4"><p className="text-sm font-medium text-ink-muted">Yayın</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">{overview.totals.active}/{overview.totals.total}</p></div>
            <div className="rounded-[22px] border border-line bg-panel-subtle p-4"><p className="text-sm font-medium text-ink-muted">Bekleyen</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">{overview.attentionTours.length}</p></div>
            <div className="rounded-[22px] border border-line bg-panel-subtle p-4"><p className="text-sm font-medium text-ink-muted">Pasif</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">{overview.totals.passive}</p></div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Son Güncellemeler" description="" action={<LoadingLink href="/tours" loadingLabel="Liste açılıyor..." className={buttonClassName({variant: 'ghost', size: 'sm'})}>Tüm liste</LoadingLink>}>
          <div className="overflow-hidden rounded-[22px] border border-line">
            <div className="hidden grid-cols-[1.4fr_0.7fr_0.8fr_0.9fr] gap-3 bg-panel-subtle px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted lg:grid">
              <span>Tur</span>
              <span>Durum</span>
              <span>Tamamlama</span>
              <span>Güncelleme</span>
            </div>
            <div className="divide-y divide-line">
              {overview.recentTours.map(({tour, completion, status}) => (
                <LoadingLink key={tour.id} href={`/tours/${tour.slug}/edit`} loadingLabel="Tur açılıyor..." className="grid gap-3 px-4 py-4 transition hover:bg-panel-subtle lg:grid-cols-[1.4fr_0.7fr_0.8fr_0.9fr] lg:items-center">
                  <div className="space-y-1"><p className="font-medium text-ink">{tour.title}</p><p className="text-sm text-ink-muted">/{tour.slug}</p></div>
                  <div><StatusBadge status={status} /></div>
                  <div className="flex items-center gap-3"><div className="h-2.5 flex-1 rounded-full bg-panel-strong"><div className="h-full rounded-full bg-brand" style={{width: `${completion}%`}} /></div><span className="text-sm font-medium text-ink">{completion}%</span></div>
                  <p className="text-sm text-ink-muted">{formatDateTime(tour.updatedAt)}</p>
                </LoadingLink>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Dikkat Gerektirenler" description="">
          <div className="space-y-3">
            {overview.attentionTours.map(({tour, issues, status}) => (
              <LoadingLink key={tour.id} href={`/tours/${tour.slug}/edit`} loadingLabel="Tur açılıyor..." className="block rounded-[22px] border border-line bg-panel-subtle p-4 transition hover:border-warning-strong/30 hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><h3 className="font-medium text-ink">{tour.title}</h3><StatusBadge status={status} /></div>
                    <div className="flex flex-wrap gap-2">{issues.slice(0, 3).map((issue) => <span key={issue} className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning-strong">{issue}</span>)}</div>
                  </div>
                  <ArrowOutwardRoundedIcon sx={{fontSize: 18}} className="text-ink-muted" />
                </div>
              </LoadingLink>
            ))}
            {overview.attentionTours.length === 0 ? <div className="rounded-[22px] border border-line bg-panel-subtle p-6 text-sm text-ink-muted">Kayıt yok</div> : null}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}

