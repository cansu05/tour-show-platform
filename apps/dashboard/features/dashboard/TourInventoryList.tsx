"use client";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import { useDeferredValue, useMemo, useState, type MouseEvent } from "react";
import type { Tour } from "@/types/tour";
import {
  formatDateTime,
  getTourHealth,
  type TourLifecycleStatus,
} from "@/features/dashboard/admin-data";
import { TourPreviewDialog, type TourPreviewData } from "@/features/dashboard/TourPreviewDialog";
import {
  buttonClassName,
  cn,
  EmptyState,
  Pill,
  SectionCard,
  StatusBadge,
  textInputClassName,
} from "@/features/dashboard/components/admin-ui";
import { LoadingLink } from "@/features/dashboard/components/LoadingLink";

type SortKey = "updated-desc" | "updated-asc" | "title-asc";
type ViewMode = "table" | "cards";

const STATUS_TABS: Array<{ key: "all" | TourLifecycleStatus; label: string }> =
  [
    { key: "all", label: "Tümü" },
    { key: "active", label: "Aktif" },
    { key: "draft", label: "Taslak" },
    { key: "passive", label: "Pasif" },
  ];

const actionLinkClassName =
  "inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-brand";

function buildPreviewData(tour: Tour): TourPreviewData {
  const health = getTourHealth(tour);

  return {
    title: tour.title,
    slug: tour.slug,
    categories: tour.categories,
    shortDescription: tour.shortDescription,
    hasTransfer: tour.hasTransfer,
    hasMeal: tour.hasMeal,
    videoUrl: tour.videoUrl,
    coverImage: tour.coverImage,
    gallery: tour.gallery,
    updatedAt: formatDateTime(tour.updatedAt),
    isActive: tour.isActive,
    status: health.status,
    completion: health.completion,
    currency: tour.pricing.currency,
    pricingByRegion: Object.entries(tour.pricing.byRegion || {}).map(
      ([regionKey, value]) => ({
        regionKey,
        adultPrice: value.adultPrice ?? undefined,
        childPrice: value.childPrice ?? undefined,
        availableDays: value.availableDays || [],
      }),
    ),
  };
}

export function TourInventoryList({ tours }: { tours: Tour[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TourLifecycleStatus>("all");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [previewTour, setPreviewTour] = useState<Tour | null>(null);
  const deferredSearch = useDeferredValue(search);

  const categories = useMemo(
    () =>
      Array.from(new Set(tours.flatMap((tour) => tour.categories))).sort(
        (left, right) => left.localeCompare(right, "tr"),
      ),
    [tours],
  );

  const items = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("tr");
    const filtered = tours
      .map((tour) => ({ tour, health: getTourHealth(tour) }))
      .filter(({ tour, health }) => {
        if (status !== "all" && health.status !== status) return false;
        if (category !== "all" && !tour.categories.includes(category)) {
          return false;
        }
        if (!normalizedSearch) return true;

        const haystack = [
          tour.title,
          tour.slug,
          tour.shortDescription,
          ...tour.categories,
        ]
          .join(" ")
          .toLocaleLowerCase("tr");
        return haystack.includes(normalizedSearch);
      });

    return filtered.sort((left, right) => {
      if (sortKey === "updated-asc") {
        return +new Date(left.tour.updatedAt) - +new Date(right.tour.updatedAt);
      }
      if (sortKey === "title-asc") {
        return left.tour.title.localeCompare(right.tour.title, "tr");
      }
      return +new Date(right.tour.updatedAt) - +new Date(left.tour.updatedAt);
    });
  }, [category, deferredSearch, sortKey, status, tours]);

  const counts = useMemo(() => {
    return tours.reduce(
      (acc, tour) => {
        const lifecycle = getTourHealth(tour).status;
        acc.all += 1;
        acc[lifecycle] += 1;
        return acc;
      },
      { all: 0, active: 0, draft: 0, passive: 0 },
    );
  }, [tours]);

  function handlePreviewClick(
    event: MouseEvent<HTMLButtonElement>,
    tour: Tour,
  ) {
    event.preventDefault();
    event.stopPropagation();
    setPreviewTour(tour);
  }

  return (
    <>
      <div className="space-y-6">
        <SectionCard
          title="Filtreler ve görünüm"
          description="Arama, durum, kategori ve sıralama seçenekleriyle envanteri daha hızlı tarayın."
        >
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.6fr))]">
              <label className="relative">
                <SearchRoundedIcon
                  sx={{ fontSize: 18 }}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tur adı, slug veya açıklama içinde ara"
                  className={cn(textInputClassName(), "pl-11")}
                />
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={textInputClassName()}
              >
                <option value="all">Tüm kategoriler</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className={textInputClassName()}
              >
                <option value="updated-desc">Son güncellenen</option>
                <option value="updated-asc">İlk güncellenen</option>
                <option value="title-asc">Ada göre A-Z</option>
              </select>

              <div className="grid grid-cols-2 gap-2 rounded-[18px] border border-line bg-panel-subtle p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    buttonClassName({
                      variant: viewMode === "table" ? "primary" : "ghost",
                      size: "sm",
                    }),
                    "w-full",
                  )}
                >
                  <TableRowsRoundedIcon sx={{ fontSize: 18 }} />
                  Tablo
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={cn(
                    buttonClassName({
                      variant: viewMode === "cards" ? "primary" : "ghost",
                      size: "sm",
                    }),
                    "w-full",
                  )}
                >
                  <ViewAgendaRoundedIcon sx={{ fontSize: 18 }} />
                  Kart
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatus(tab.key)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    status === tab.key
                      ? "bg-brand text-white shadow-[0_16px_28px_rgba(79,70,229,0.22)]"
                      : "border border-line bg-panel text-ink-soft hover:bg-panel-subtle",
                  )}
                >
                  {tab.label} ({counts[tab.key]})
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {items.length === 0 ? (
          <EmptyState
            title="Filtreye uyan tur bulunamadı"
            description="Arama ve filtreleri gevşeterek envanterdeki diğer kayıtları görebilirsiniz."
            action={
              <LoadingLink
                href="/tours/new"
                loadingLabel="Form açılıyor..."
                className={buttonClassName({ variant: "primary" })}
              >
                Yeni tur oluştur
              </LoadingLink>
            }
          />
        ) : null}

        {items.length > 0 && viewMode === "table" ? (
          <SectionCard
            title="Tur listesi"
            description="Kompakt tablo görünümü çok sayıda turu daha az dikey alan kullanarak taramanızı sağlar."
            action={<Pill>{items.length} sonuç</Pill>}
          >
            <div className="overflow-hidden rounded-[24px] border border-line">
              <div className="hidden grid-cols-[minmax(0,1.45fr)_0.6fr_0.9fr_0.9fr_1.05fr_1.05fr] gap-4 bg-panel-subtle px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted xl:grid">
                <span>Tur</span>
                <span>Durum</span>
                <span>Meta</span>
                <span>Kategoriler</span>
                <span>Son güncelleme</span>
                <span>Aksiyonlar</span>
              </div>
              <div className="divide-y divide-line">
                {items.map(({ tour, health }) => (
                  <div
                    key={tour.id}
                    className="grid gap-4 px-4 py-4 transition hover:bg-panel-subtle xl:grid-cols-[minmax(0,1.45fr)_0.6fr_0.9fr_0.9fr_1.05fr_1.05fr] xl:items-center"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-ink">
                          {tour.title}
                        </p>
                        <span className="rounded-full bg-panel-strong px-2 py-1 text-[11px] font-medium text-ink-soft">
                          /{tour.slug}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm leading-6 text-ink-muted">
                        {tour.shortDescription || "Kısa açıklama girilmemiş."}
                      </p>
                    </div>
                    <div>
                      <StatusBadge status={health.status} />
                    </div>
                    <div className="space-y-1 text-sm text-ink-muted">
                      <p>Transfer: {tour.hasTransfer ? "Var" : "Yok"}</p>
                      <p>Yemek: {tour.hasMeal ? "Var" : "Yok"}</p>
                      <p>Video: {tour.videoUrl ? "Var" : "Yok"}</p>
                      <p>Galeri: {tour.gallery.length}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tour.categories.map((item) => (
                        <span
                          key={`${tour.id}-${item}`}
                          className="rounded-full border border-line bg-panel px-2.5 py-1 text-xs font-medium text-ink-soft"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-1 text-sm text-ink-muted">
                      <p>{formatDateTime(tour.updatedAt)}</p>
                      <p>%{health.completion} tamamlandı</p>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <button
                        type="button"
                        onClick={(event) => handlePreviewClick(event, tour)}
                        className={actionLinkClassName}
                      >
                        <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                        Önizle
                      </button>
                      <LoadingLink
                        href={`/tours/${tour.slug}/edit`}
                        loadingLabel="Tur açılıyor..."
                        className={actionLinkClassName}
                      >
                        <EditRoundedIcon sx={{ fontSize: 18 }} />
                        Düzenle
                      </LoadingLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        ) : null}

        {items.length > 0 && viewMode === "cards" ? (
          <div className="grid gap-4 2xl:grid-cols-2">
            {items.map(({ tour, health }) => (
              <SectionCard
                key={tour.id}
                title={tour.title}
                description={tour.shortDescription || "Kısa açıklama girilmemiş."}
                compact
                action={<StatusBadge status={health.status} />}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Pill>/{tour.slug}</Pill>
                    <Pill>Galeri {tour.gallery.length}</Pill>
                    <Pill>Video {tour.videoUrl ? "Var" : "Yok"}</Pill>
                    <Pill>Transfer {tour.hasTransfer ? "Var" : "Yok"}</Pill>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tour.categories.map((item) => (
                      <span
                        key={`${tour.id}-${item}`}
                        className="rounded-full bg-panel-strong px-2.5 py-1 text-xs font-medium text-ink-soft"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-ink-muted">
                    <span>Son güncelleme {formatDateTime(tour.updatedAt)}</span>
                    <span>%{health.completion} tamamlandı</span>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <button
                      type="button"
                      onClick={(event) => handlePreviewClick(event, tour)}
                      className={actionLinkClassName}
                    >
                      <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                      Önizle
                    </button>
                    <LoadingLink
                      href={`/tours/${tour.slug}/edit`}
                      loadingLabel="Tur açılıyor..."
                      className={actionLinkClassName}
                    >
                      <EditRoundedIcon sx={{ fontSize: 18 }} />
                      Düzenle
                    </LoadingLink>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        ) : null}
      </div>

      {previewTour ? (
        <TourPreviewDialog
          preview={buildPreviewData(previewTour)}
          onClose={() => setPreviewTour(null)}
        />
      ) : null}
    </>
  );
}
