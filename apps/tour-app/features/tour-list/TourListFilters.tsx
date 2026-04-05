import {Paper, Stack} from '@mui/material';
import {CategoryFilters} from '@/components/search/CategoryFilters';
import {SearchBar} from '@/components/search/SearchBar';

export function TourListFilters({
  search,
  categories,
  activeCategory,
  onSearchChange,
  onCategoryChange,
  onVoiceClick
}: {
  search: string;
  categories: string[];
  activeCategory: string | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onVoiceClick: () => void;
}) {
  return (
    <Stack spacing={1.6}>
      <Paper
        elevation={0}
        sx={{
          px: {xs: 2.2, md: 3},
          py: {xs: 2, md: 2.3},
          borderRadius: 2.5,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F3FAFD 100%)',
          boxShadow: '0 8px 26px rgba(5,63,92,0.08)'
        }}
      >
        <SearchBar value={search} onChange={onSearchChange} onVoiceClick={onVoiceClick} />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          px: {xs: 2.2, md: 3},
          py: {xs: 1.7, md: 2},
          borderRadius: 2.5,
          background: 'rgba(255,255,255,0.78)',
          boxShadow: '0 8px 22px rgba(5,63,92,0.06)'
        }}
      >
        <CategoryFilters categories={categories} value={activeCategory} onChange={onCategoryChange} />
      </Paper>
    </Stack>
  );
}
