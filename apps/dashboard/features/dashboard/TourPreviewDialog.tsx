"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import { TOUR_DAYS, TOUR_REGIONS } from "@shared/index";
import { useEffect, useMemo, useState } from "react";
import type { TourLifecycleStatus } from "@/features/dashboard/admin-data";
import { Pill, StatusBadge } from "@/features/dashboard/components/admin-ui";

type PreviewRegionPricing = {
  regionKey: string;
  adultPrice?: number;
  childPrice?: number;
  availableDays: string[];
};

export type TourPreviewData = {
  title: string;
  slug: string;
  categories: string[];
  shortDescription: string;
  hasTransfer: boolean;
  hasMeal: boolean;
  videoUrl?: string;
  coverImage?: string;
  gallery: string[];
  updatedAt?: string;
  isActive: boolean;
  status: TourLifecycleStatus;
  completion: number;
  currency?: string;
  pricingByRegion: PreviewRegionPricing[];
};

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

function isAbsoluteMediaUrl(value: string) {
  return /^(https?:\/\/|data:|blob:)/i.test(value);
}

export function toDashboardMediaUrl(value?: string) {
  if (!value) return "";
  if (isAbsoluteMediaUrl(value)) return value;
  if (!value.startsWith("/")) return value;
  return `/api/dashboard/media${value}`;
}

export function TourPreviewDialog({
  preview,
  onClose,
}: {
  preview: TourPreviewData;
  onClose: () => void;
}) {
  const dayLabelMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(TOUR_DAYS.map((day) => [day.key, day.label])),
    [],
  );
  const regionLabelMap = useMemo<Record<string, string>>(
    () =>
      Object.fromEntries(TOUR_REGIONS.map((region) => [region.key, region.label])),
    [],
  );
  const mediaItems = useMemo<MediaItem[]>(() => {
    const imageSources = [preview.coverImage, ...preview.gallery]
      .map((item) => toDashboardMediaUrl(item))
      .filter(Boolean);
    const uniqueImages = Array.from(new Set(imageSources));
    const items: MediaItem[] = uniqueImages.map((src) => ({ type: "image", src }));

    if (preview.videoUrl) {
      items.push({ type: "video", src: toDashboardMediaUrl(preview.videoUrl) });
    }

    return items;
  }, [preview]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  useEffect(() => {
    setActiveMediaIndex(0);
  }, [preview.slug]);

  useEffect(() => {
    if (activeMediaIndex >= mediaItems.length) {
      setActiveMediaIndex(0);
    }
  }, [activeMediaIndex, mediaItems.length]);

  const activeMedia = mediaItems[activeMediaIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.52)] p-4">
      <button
        type="button"
        aria-label="Önizlemeyi kapat"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-line bg-panel p-4 shadow-[0_32px_80px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Kart önizleme
            </p>
            <h3 className="text-2xl font-semibold text-ink">{preview.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>/{preview.slug}</Pill>
              <StatusBadge status={preview.status} />
              <Pill>%{preview.completion} tamamlandı</Pill>
            </div>
          </div>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel-subtle text-ink transition hover:bg-panel-strong"
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-line bg-white">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.45fr)_360px]">
            <div className="border-b border-line lg:border-b-0 lg:border-r">
              <div className="relative h-72 w-full bg-panel-subtle sm:h-[28rem]">
                {activeMedia ? (
                  activeMedia.type === "video" ? (
                    <video
                      src={activeMedia.src}
                      controls
                      className="h-full w-full bg-black object-contain"
                    />
                  ) : (
                    <img
                      src={activeMedia.src}
                      alt={preview.title}
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] text-ink-muted">
                    <Inventory2OutlinedIcon sx={{ fontSize: 42 }} />
                    <p className="text-sm font-medium">Medya eklenmemiş</p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,23,42,0.72)] to-transparent p-6 text-white">
                  <div className="flex flex-wrap gap-2">
                    {preview.categories.map((item) => (
                      <span
                        key={`${preview.slug}-preview-${item}`}
                        className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {mediaItems.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto border-t border-line px-5 py-4">
                  {mediaItems.map((item, index) => (
                    <button
                      key={`${item.type}-${item.src}-${index}`}
                      type="button"
                      onClick={() => setActiveMediaIndex(index)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-[18px] border transition ${
                        index === activeMediaIndex
                          ? "border-brand shadow-[0_10px_24px_rgba(79,70,229,0.18)]"
                          : "border-line"
                      }`}
                    >
                      {item.type === "video" ? (
                        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#0f172a,#334155)] text-white">
                          <PlayCircleOutlineRoundedIcon sx={{ fontSize: 28 }} />
                        </div>
                      ) : (
                        <img
                          src={item.src}
                          alt={`${preview.title} medya ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-5 p-6">
              <p className="text-base leading-7 text-ink-soft">
                {preview.shortDescription || "Kısa açıklama girilmemiş."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] bg-panel-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Transfer
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {preview.hasTransfer ? "Var" : "Yok"}
                  </p>
                </div>
                <div className="rounded-[20px] bg-panel-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Yemek
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {preview.hasMeal ? "Var" : "Yok"}
                  </p>
                </div>
                <div className="rounded-[20px] bg-panel-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Video
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {preview.videoUrl ? "Var" : "Yok"}
                  </p>
                </div>
                <div className="rounded-[20px] bg-panel-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Galeri
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {preview.gallery.length} görsel
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-line pt-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Fiyat ve Günler
                  </p>
                  {preview.currency ? (
                    <span className="text-xs font-medium text-ink-muted">
                      Para birimi: {preview.currency}
                    </span>
                  ) : null}
                </div>
                {preview.pricingByRegion.length > 0 ? (
                  <div className="space-y-3">
                    {preview.pricingByRegion.map((region) => (
                      <div
                        key={region.regionKey}
                        className="rounded-[20px] bg-panel-subtle p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-ink">
                            {regionLabelMap[region.regionKey] || region.regionKey}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm font-medium text-ink">
                            <span>
                              Yetişkin:{" "}
                              {region.adultPrice !== undefined
                                ? `${region.adultPrice} ${preview.currency || ""}`.trim()
                                : "-"}
                            </span>
                            <span>
                              Çocuk:{" "}
                              {region.childPrice !== undefined
                                ? `${region.childPrice} ${preview.currency || ""}`.trim()
                                : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {region.availableDays.length > 0 ? (
                            region.availableDays.map((dayKey) => (
                              <span
                                key={`${region.regionKey}-${dayKey}`}
                                className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-soft"
                              >
                                {dayLabelMap[dayKey] || dayKey}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-ink-muted">
                              Gün seçilmemiş
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[20px] bg-panel-subtle p-4 text-sm text-ink-muted">
                    Henüz fiyat veya gün bilgisi girilmemiş.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-ink-muted">
                <span>
                  {preview.updatedAt ? `Son güncelleme ${preview.updatedAt}` : "Henüz kaydedilmedi"}
                </span>
                <span>{preview.isActive ? "Yayında" : "Yayında değil"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
