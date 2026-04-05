"use client";

import {useDeferredValue, useMemo, useState} from "react";
import type {Tour} from "@/types/tour";
import {getTourHealth, type TourLifecycleStatus} from "@/features/dashboard/admin-data";
import {TourPreviewDialog} from "@/features/dashboard/TourPreviewDialog";
import {TourInventoryCards} from "@/features/dashboard/components/TourInventoryCards";
import {TourInventoryFilters} from "@/features/dashboard/components/TourInventoryFilters";
import {TourInventoryTable} from "@/features/dashboard/components/TourInventoryTable";
import {EmptyState, buttonClassName} from "@/features/dashboard/components/admin-ui";
import {LoadingLink} from "@/features/dashboard/components/LoadingLink";
import {type TourInventorySortKey, type TourInventoryViewMode} from "@/features/dashboard/tour-inventory.types";
import {buildTourInventoryPreviewData} from "@/features/dashboard/tour-inventory.utils";

type TourInventoryListProps = {
  tours: Tour[];
};

export function TourInventoryList({tours}: TourInventoryListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TourLifecycleStatus>("all");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState<TourInventorySortKey>("updated-desc");
  const [viewMode, setViewMode] = useState<TourInventoryViewMode>("table");
  const [previewTour, setPreviewTour] = useState<Tour | null>(null);
  const deferredSearch = useDeferredValue(search);

  const categories = useMemo(
    () =>
      Array.from(new Set(tours.flatMap((tour) => tour.categories))).sort((left, right) =>
        left.localeCompare(right, "tr"),
      ),
    [tours],
  );

  const toursWithHealth = useMemo(
    () => tours.map((tour) => ({tour, health: getTourHealth(tour)})),
    [tours],
  );

  const items = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("tr");
    const filtered = toursWithHealth.filter(({tour, health}) => {
      if (status !== "all" && health.status !== status) return false;
      if (category !== "all" && !tour.categories.includes(category)) return false;
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
  }, [category, deferredSearch, sortKey, status, toursWithHealth]);

  const counts = useMemo(
    () =>
      toursWithHealth.reduce(
        (acc, {health}) => {
          acc.all += 1;
          acc[health.status] += 1;
          return acc;
        },
        {all: 0, active: 0, draft: 0, passive: 0},
      ),
    [toursWithHealth],
  );

  return (
    <>
      <div className="space-y-6">
        <TourInventoryFilters
          search={search}
          category={category}
          sortKey={sortKey}
          viewMode={viewMode}
          status={status}
          categories={categories}
          counts={counts}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSortKey}
          onViewModeChange={setViewMode}
          onStatusChange={setStatus}
        />

        {items.length === 0 ? (
          <EmptyState
            title="Filtreye uyan tur bulunamadı"
            description="Arama ve filtreleri gevşeterek envanterdeki diğer kayıtları görebilirsiniz."
            action={
              <LoadingLink
                href="/tours/new"
                loadingLabel="Form açılıyor..."
                className={buttonClassName({variant: "primary"})}
              >
                Yeni tur oluştur
              </LoadingLink>
            }
          />
        ) : null}

        {items.length > 0 && viewMode === "table" ? (
          <TourInventoryTable items={items} onPreview={setPreviewTour} />
        ) : null}

        {items.length > 0 && viewMode === "cards" ? (
          <TourInventoryCards items={items} onPreview={setPreviewTour} />
        ) : null}
      </div>

      {previewTour ? (
        <TourPreviewDialog
          preview={buildTourInventoryPreviewData(previewTour)}
          onClose={() => setPreviewTour(null)}
        />
      ) : null}
    </>
  );
}
