import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { CategoryFilters } from "@/components/search/CategoryFilters";
import { SearchBar } from "@/components/search/SearchBar";
import { radiusTokens } from "@/theme/tokens";

export function TourListFilters({
  search,
  categories,
  activeCategory,
  onSearchChange,
  onCategoryChange,
  onVoiceClick,
}: {
  search: string;
  categories: string[];
  activeCategory: string | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onVoiceClick: () => void;
}) {
  const tHome = useTranslations("home");
  const popularSearches = [
    tHome("popularSearchJeepSafari"),
    tHome("popularSearchBoatTour"),
    tHome("popularSearchDivingTour"),
    tHome("popularSearchAquarium"),
    tHome("popularSearchAlanyaDaily"),
  ];

  return (
    <Stack
      spacing={1.55}
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: { xs: 0, md: -8 },
        zIndex: 3,
        width: "100%",
        alignItems: "center",
        mx: "auto",
        mt: 0,
        px: { xs: 0.6, md: 0 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: { xs: "calc(100% - 12px)", md: "min(1100px, calc(100% - 32px))" },
          mx: "auto",
          px: { xs: 0.8, md: 1.55 },
          py: { xs: 0.95, md: 1.35 },
          borderRadius: `${radiusTokens.lg}px`,
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onVoiceClick={onVoiceClick}
        />
        <Stack
          direction="row"
          alignItems="center"
          gap={0.8}
          sx={{
            pt: { xs: 0.8, md: 1 },
            px: { xs: 0.1, md: 0.8 },
            overflowX: { xs: "visible", md: "auto" },
            flexWrap: { xs: "wrap", md: "nowrap" },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 900,
              color: "#304C6B",
              whiteSpace: "nowrap",
            }}
          >
            {tHome("popularSearchesLabel")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.55, md: 1 },
              width: { xs: "100%", md: "max-content" },
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            {popularSearches.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onClick={() => onSearchChange(item)}
                sx={{
                  height: { xs: 24, md: 22 },
                  px: { xs: 0.45, md: 0.8 },
                  bgcolor: "#fcfcfc",
                  color: "#6E8196",
                  fontSize: { xs: 9.7, md: 10.5 },
                  border: "1px solid #E6EEF5",
                  borderRadius: `${radiusTokens.md}px`,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#EAF3FB" },
                }}
              />
            ))}
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1220,
          px: { xs: 0, md: 0 },
          py: 0,
          borderRadius: radiusTokens.none,
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <CategoryFilters
          categories={categories}
          value={activeCategory}
          onChange={onCategoryChange}
        />
      </Paper>
    </Stack>
  );
}
