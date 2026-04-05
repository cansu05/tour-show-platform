'use client';

import {Box, Button, Stack} from '@mui/material';
import {useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {FeedbackSnackbar} from '@/components/common/FeedbackSnackbar';
import {StateCard} from '@/components/common/StateCard';
import {TourGrid} from '@/components/tour/TourGrid';
import type {AppLocale} from '@/constants/locales';
import {SEARCH_DEBOUNCE_MS} from '@/constants/app';
import {useDebouncedValue} from '@/hooks/useDebouncedValue';
import {useSpeechRecognition} from '@/hooks/useSpeechRecognition';
import {TourListFilters} from '@/features/tour-list/TourListFilters';
import {TourListHero} from '@/features/tour-list/TourListHero';
import {INITIAL_VISIBLE_TOURS, LOAD_MORE_STEP} from '@/features/tour-list/tour-list.constants';
import type {TourListClientProps, TourListFeedbackState} from '@/features/tour-list/tour-list.types';
import {getAvailableCategories, rankToursForDisplay} from '@/features/tour-list/tour-list.utils';

export function TourListClient({tours}: TourListClientProps) {
  const locale = useLocale() as AppLocale;
  const tHome = useTranslations('home');
  const tSearch = useTranslations('search');

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TOURS);
  const [feedback, setFeedback] = useState<TourListFeedbackState>({
    open: false,
    message: '',
    type: 'info'
  });

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const availableCategories = useMemo(() => getAvailableCategories(tours, locale), [locale, tours]);
  const ranked = useMemo(
    () => rankToursForDisplay({tours, category: activeCategory, search: debouncedSearch, locale}),
    [activeCategory, debouncedSearch, locale, tours]
  );

  const speech = useSpeechRecognition({
    lang: locale,
    onResult: (text) => {
      setSearch(text);
      setFeedback({open: true, message: text, type: 'success'});
    },
    onError: (code) => {
      const message =
        code === 'not-allowed'
          ? tSearch('micPermissionDenied')
          : code === 'unsupported'
            ? tSearch('speechUnsupported')
            : tSearch('speechNotDetected');
      setFeedback({open: true, message, type: 'error'});
    }
  });

  const showNoResult = tours.length > 0 && ranked.list.length === 0;
  const visibleTours = ranked.list.slice(0, visibleCount);
  const remainingTours = Math.max(ranked.list.length - visibleCount, 0);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(INITIAL_VISIBLE_TOURS);
  };

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE_TOURS);
  };

  return (
    <Stack spacing={{xs: 3, md: 4}}>
      <TourListHero title={tHome('title')} subtitle={tHome('subtitle')} />

      <TourListFilters
        search={search}
        categories={availableCategories}
        activeCategory={activeCategory}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onVoiceClick={speech.start}
      />

      {tours.length === 0 ? <StateCard title={tHome('noActiveTours')} /> : null}

      {showNoResult ? (
        <StateCard
          title={tSearch('noResults', {searchTerm: debouncedSearch})}
          description={
            ranked.suggestions.length
              ? `${tSearch('suggestionsTitle')} ${ranked.suggestions.join(', ')}`
              : undefined
          }
        />
      ) : null}

      {!showNoResult && tours.length > 0 ? <TourGrid tours={visibleTours} locale={locale} /> : null}

      {!showNoResult && remainingTours > 0 ? (
        <Box display="flex" justifyContent="center" pt={0.5}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            sx={{px: 4.5, py: 1.3, borderRadius: 999, minWidth: 210}}
          >
            {tHome('loadMoreTours', {count: Math.min(LOAD_MORE_STEP, remainingTours)})}
          </Button>
        </Box>
      ) : null}

      <FeedbackSnackbar
        open={feedback.open}
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback((prev) => ({...prev, open: false}))}
      />
    </Stack>
  );
}
