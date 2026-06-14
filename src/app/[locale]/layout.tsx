import type { Metadata } from 'next';
import '../globals.css';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: {
    default: 'A Caminho da FACIM 2026 — Província de Maputo',
    template: '%s | FACIM 2026',
  },
  description:
    'Plataforma de Gestão e Promoção da Participação da Província de Maputo na 61ª Edição da FACIM 2026. Inscreva a sua empresa e participe na maior feira internacional de Moçambique.',
  keywords: [
    'FACIM',
    'FACIM 2026',
    'Feira',
    'Moçambique',
    'Maputo',
    'Expositor',
    'Patrocínio',
    'Indústria',
    'Comércio',
  ],
  authors: [{ name: 'DPIC Maputo' }],
  openGraph: {
    title: 'A Caminho da FACIM 2026 — Província de Maputo',
    description:
      'Plataforma de Gestão e Promoção da Participação da Província de Maputo na 61ª Edição da FACIM 2026.',
    type: 'website',
    locale: 'pt_MZ',
  },
};

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
