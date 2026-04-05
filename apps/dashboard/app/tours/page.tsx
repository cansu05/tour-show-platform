import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DashboardShell } from "@/features/dashboard/DashboardShell";
import { TourInventoryList } from "@/features/dashboard/TourInventoryList";
import { Pill } from "@/features/dashboard/components/admin-ui";
import { LoadingLink } from "@/features/dashboard/components/LoadingLink";
import { getAllTours } from "@/services/tour.service";

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const tours = await getAllTours().catch(() => []);

  return (
    <DashboardShell
      eyebrow="Tur Envanteri"
      title="Tur Listesi"
      description="Tüm kayıtlar"
      actions={
        <LoadingLink href="/tours/new" loadingLabel="Form açılıyor..." className="inline-flex items-center gap-2 rounded-full border border-line bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-3 text-sm font-semibold text-ink transition hover:border-line-strong hover:bg-white hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)]">
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          Yeni Tur Ekle
        </LoadingLink>
      }
      meta={
        <>
          <Pill>{tours.length} kayıt</Pill>
          <Pill>Tablo görünümü</Pill>
        </>
      }
    >
      <TourInventoryList tours={tours} />
    </DashboardShell>
  );
}

