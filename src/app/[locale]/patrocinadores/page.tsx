import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

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

  // Merge static styling props
  const packages = [
    { ...packagesData[0], icon: '💎', color: '#534AB7', bgClass: 'pkgPlatinum' },
    { ...packagesData[1], icon: '🥇', color: '#7A4A00', bgClass: 'pkgGold' },
    { ...packagesData[2], icon: '🥈', color: '#5F5E5A', bgClass: 'pkgSilver' },
    { ...packagesData[3], icon: '🥉', color: '#C87840', bgClass: 'pkgBronze' },
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

      <section className={styles.packagesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className="t-eyebrow">{t('section.eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{t('section.title')}</h2>
            <p className={styles.sectionSub}>
              {t('section.sub')}
            </p>
          </div>

          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div key={pkg.nome} className={`${styles.packageCard} ${styles[pkg.bgClass]}`}>
                <div className={styles.packageHeader}>
                  <span className={styles.packageIcon}>{pkg.icon}</span>
                  <h3 className={styles.packageName} style={{ color: pkg.color }}>{pkg.nome}</h3>
                  <span className={styles.packageNivel}>{pkg.nivel}</span>
                </div>

                <ul className={styles.beneficiosList}>
                  {pkg.beneficios.map((b, i) => (
                    <li key={i}>
                      <i className="ti ti-check" aria-hidden="true" style={{ color: pkg.color }}></i>
                      {b}
                    </li>
                  ))}
                </ul>

                <Link href="/patrocinador/registar" className={`btn btn-block ${styles.packageBtn}`} style={{ borderColor: pkg.color, color: pkg.color }}>
                  {t('btnInterest')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

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
