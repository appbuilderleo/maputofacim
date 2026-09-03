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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      mp: {
                        blue: '#4382C3',
                        blueDark: '#1E4F8A',
                        blueDeep: '#0B2545',
                        blueLight: '#EBF3FA',
                        blueHover: '#2B6CB0',
                        green: '#45B48E',
                        greenDark: '#1A7A57',
                        greenLight: '#EAF7F2',
                        yellow: '#FCC24F',
                        yellowDark: '#D99B26',
                        yellowLight: '#FEF8E7',
                        orange: '#EF5A24',
                        orangeHover: '#D34412',
                        slate: '#0F172A',
                        surface: '#F8FAFC'
                      }
                    },
                    fontFamily: {
                      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                      display: ['"Outfit"', 'sans-serif']
                    }
                  }
                }
              }
            `,
          }}
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
