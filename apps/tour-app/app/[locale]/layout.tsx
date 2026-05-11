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
          background: 'linear-gradient(180deg, #F4FAFF 0%, #FFFFFF 58%)',
          py: {xs: 1.2, md: 1.6}
        }}
      >
        <Container maxWidth={false} sx={{px: {xs: 1.2, md: 1.8}}}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: 1540,
              mx: 'auto',
              px: 0,
              py: 0
            }}
          >
            <Box sx={{position: 'absolute', top: {xs: 10, md: 0}, right: {xs: 10, md: 34}, zIndex: 5}}>
              <LocaleSwitcher />
            </Box>
            <Stack spacing={{xs: 2, md: 2.2}}>{children}</Stack>
          </Box>
        </Container>
      </Box>
    </NextIntlClientProvider>
  );
}
