"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/constants/locales";
import {
  AllToursIcon,
  categoryIcons,
} from "@/components/search/category-icons";
import { formatCategoryLabel } from "@/utils/tour-labels";
import {
  getCategoryIconColor,
  getCategoryIconKey,
  sortCategoriesForFilters,
} from "@/components/search/category-filter-icons";
import { radiusTokens } from "@/theme/tokens";

type Props = {
  categories: string[];
  value: string | null;
  onChange: (category: string | null) => void;
};

const IconByCategory = {
  aile: categoryIcons.family,
  doga: categoryIcons.nature,
  gunubirlik: categoryIcons.daily,
  konaklamali: categoryIcons.hotel,
  macera: categoryIcons.adventure,
  tarih: categoryIcons.history,
};

export function CategoryFilters({ categories, value, onChange }: Props) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("home");
  const orderedCategories = sortCategoriesForFilters(categories, locale);

  return (
    <Stack spacing={1.5} sx={{ alignItems: "center" }}>
      <Typography
        variant="h4"
        sx={{ display: "none", color: "text.secondary" }}
      >
        {t("categories")}
      </Typography>
      <Box
        sx={{
          width: "100%",
          overflowX: { xs: "visible", md: "auto" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          direction="row"
          justifyContent={{ xs: "flex-start", md: "center" }}
          gap={{ xs: 0.8, md: 2 }}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
          sx={{
            width: { xs: "100%", md: "max-content" },
            minWidth: "100%",
            py: { xs: 0.25, md: 0.5 },
            px: { xs: 0.4, md: 0 },
          }}
        >
          <Chip
            icon={<AllToursIcon />}
            label={t("allCategories")}
            clickable
            color={value === null ? "primary" : "default"}
            variant="filled"
            sx={{
              minWidth: { xs: 100, md: 118 },
              height: { xs: 40, md: 50 },
              px: { xs: 0.9, md: 1.55 },
              borderRadius: `${radiusTokens.lg}px`,
              bgcolor: value === null ? "#00437D" : "#FFFFFF",
              color: value === null ? "#FFFFFF" : "#263F5A",
              "& .MuiChip-icon": {
                width: { xs: 17, md: 19 },
                height: { xs: 17, md: 19 },
                color: value === null ? "#FFFFFF" : "#4B79A9",
                ml: 0.2,
                mr: 1,
              },
              "& .MuiChip-label": { px: 0.3 },
            }}
            onClick={() => onChange(null)}
          />
          {orderedCategories.map((category) => {
            const iconKey = getCategoryIconKey(category);
            const Icon = IconByCategory[iconKey as keyof typeof IconByCategory];

            return (
              <Chip
                key={category}
                icon={Icon ? <Icon /> : undefined}
                label={formatCategoryLabel(category, locale)}
                clickable
                color={value === category ? "primary" : "default"}
                variant="filled"
                sx={{
                  minWidth: { xs: 100, md: 118 },
                  height: { xs: 40, md: 50 },
                  px: { xs: 0.9, md: 1.55 },
                  borderRadius: `${radiusTokens.lg}px`,
                  bgcolor: value === category ? "#00437D" : "#FFFFFF",
                  color: value === category ? "#FFFFFF" : "#263F5A",
                  border:
                    value === category ? 0 : "1px solid rgba(226,234,242,0.9)",
                  "& .MuiChip-icon": {
                    width: { xs: 17, md: 19 },
                    height: { xs: 17, md: 19 },
                    color:
                      value === category
                        ? "#FFFFFF"
                        : getCategoryIconColor(category),
                    ml: 0.2,
                    mr: 1,
                  },
                  "& .MuiChip-label": { px: 0.3 },
                }}
                onClick={() => onChange(category)}
              />
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
