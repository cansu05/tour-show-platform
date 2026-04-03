import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Box, Container, Stack} from '@mui/material';
import {routing} from '@/i18n/routing';
import {LocaleSwitcher} from '@/components/layout/LocaleSwitcher';
import {RouteTransitionLoader} from '@/components/common/RouteTransitionLoader';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <RouteTransitionLoader />
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at 8% 6%, rgba(159,231,245,0.62) 0%, rgba(159,231,245,0) 34%), radial-gradient(circle at 92% -8%, rgba(247,173,25,0.28) 0%, rgba(247,173,25,0) 36%), linear-gradient(165deg, #F6FBFD 0%, #EBF5FA 100%)',
          py: {xs: 2, md: 3.5}
        }}
      >
        <Container maxWidth="xl" sx={{px: {xs: 1.5, md: 3}}}>
          <Box
            sx={{
              maxWidth: 1360,
              mx: 'auto',
              px: {xs: 1.2, md: 2.5},
              py: {xs: 1.2, md: 2},
              borderRadius: 2.5,
              bgcolor: 'rgba(255,255,255,0.72)',
              backdropFilter: {xs: 'none', md: 'blur(4px)'},
              boxShadow: '0 14px 36px rgba(5,63,92,0.10)'
            }}
          >
            <Stack spacing={{xs: 2, md: 2.75}}>
              <LocaleSwitcher />
              {children}
            </Stack>
          </Box>
        </Container>
      </Box>
    </NextIntlClientProvider>
  );
}
