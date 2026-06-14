import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Últimas notícias e actualizações sobre a participação da Província de Maputo na FACIM 2026.',
};

// The static data has been moved to translations

interface Noticia {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

export default function NoticiasPage() {
  const t = useTranslations('Noticias');
  const items = t.raw('items') as Noticia[];

  // Restore slugs and destaque static flags that are tied to routes
  const noticias = [
    { ...items[0], slug: 'lancamento-plataforma-facim-2026', destaque: true },
    { ...items[1], slug: 'abertura-inscricoes-expositores', destaque: true },
    { ...items[2], slug: 'reuniao-preparatoria-distritos', destaque: false },
    { ...items[3], slug: 'pacotes-patrocinio-disponiveis', destaque: false },
    { ...items[4], slug: 'calendario-actividades-preparatorias', destaque: false },
    { ...items[5], slug: 'formacao-empresas-participantes', destaque: false },
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <span className={styles.eyebrow}>{t('hero.eyebrow')}</span>
          <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
          <p className={styles.heroSub}>
            {t('hero.sub')}
          </p>
        </div>
      </section>

      <section className={styles.newsSection}>
        <div className={styles.container}>
          {/* Featured News */}
          <div className={styles.featuredGrid}>
            {noticias.filter((n) => n.destaque).map((noticia) => (
              <Link key={noticia.slug} href={`/noticias/${noticia.slug}`} className={styles.featuredCard}>
                <div className={styles.featuredImgPlaceholder}>
                  <i className="ti ti-news" aria-hidden="true"></i>
                </div>
                <div className={styles.featuredContent}>
                  <div className={styles.newsMetaRow}>
                    <span className={`badge badge-orange`}>{noticia.categoria}</span>
                    <span className={styles.newsDate}>{noticia.data}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{noticia.titulo}</h2>
                  <p className={styles.featuredResumo}>{noticia.resumo}</p>
                  <span className={styles.readMore}>{t('readMore')}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* All News */}
          <div className={styles.allNewsHeader}>
            <h2>{t('allNews')}</h2>
          </div>

          <div className={styles.newsGrid}>
            {noticias.map((noticia) => (
              <Link key={noticia.slug} href={`/noticias/${noticia.slug}`} className={styles.newsCard}>
                <div className={styles.newsImgPlaceholder}>
                  <i className="ti ti-news" aria-hidden="true"></i>
                </div>
                <div className={styles.newsContent}>
                  <div className={styles.newsMetaRow}>
                    <span className={`badge badge-orange`} style={{ fontSize: '10px', padding: '3px 8px' }}>{noticia.categoria}</span>
                    <span className={styles.newsDate}>{noticia.data}</span>
                  </div>
                  <h3 className={styles.newsTitle}>{noticia.titulo}</h3>
                  <p className={styles.newsResumo}>{noticia.resumo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
