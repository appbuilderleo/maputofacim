import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import StackingCards from '@/components/StackingCards';

export const metadata: Metadata = {
  title: 'Pacotes de Patrocínio',
  description: 'Conheça os pacotes de patrocínio disponíveis para a FACIM 2026 e associe a sua marca à maior feira de Moçambique.',
};

// The static data has been moved to translations

interface Pacote {
  nome: string;
  color: string;
  bgClass: string;
  nivel: string;
  icon: string;
  beneficios: string[];
}

export default function PatrocinadoresPage() {
  const t = useTranslations('Patrocinadores');
  const packagesData = t.raw('packages') as Pacote[];

  // Map to the requested images and dark contrasting colors for cards
  const packages = [
    { ...packagesData[0], link: '/patrocinador/registar', color: '#112240', url: '/uploads/diamante.PNG' },
    { ...packagesData[1], link: '/patrocinador/registar', color: '#1a365d', url: '/uploads/platina.PNG' },
    { ...packagesData[2], link: '/patrocinador/registar', color: '#744210', url: '/uploads/ouro.PNG' },
    { ...packagesData[3], link: '/patrocinador/registar', color: '#4a5568', url: '/uploads/prata.PNG' },
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <span className={styles.eyebrow}>{t('hero.eyebrow')}</span>
          <h1 className={styles.heroTitle}>
            {t('hero.title')} <span className={styles.highlight}>{t('hero.highlight')}</span>
          </h1>
          <p className={styles.heroSub}>
            {t('hero.sub')}
          </p>
        </div>
      </section>

      <StackingCards projects={packages} />

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.desc')}</p>
            <div className={styles.ctaActions}>
              <Link href="/contactos" className="btn btn-primary">
                <i className="ti ti-mail" aria-hidden="true"></i>
                {t('cta.btnContact')}
              </Link>
              <Link href="/patrocinador/registar" className="btn btn-white">
                {t('cta.btnRegister')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
