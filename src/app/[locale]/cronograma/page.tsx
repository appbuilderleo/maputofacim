import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Cronograma',
  description: 'Calendário de actividades e datas importantes para a preparação e participação na FACIM 2026.',
};

// The static data has been moved to translations

interface Fase {
  mes: string;
  fase: string;
  actividades: Array<{ titulo: string; desc: string; }>;
}

export default function CronogramaPage() {
  const t = useTranslations('Cronograma');
  const fases = t.raw('fases') as Fase[];

  // Define statuses statically to preserve logic
  const statuses = [
    ['concluido', 'em-curso'],
    ['pendente', 'pendente', 'pendente'],
    ['pendente', 'pendente', 'pendente', 'destaque'],
    ['pendente']
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

      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.timelineWrapper}>
            {fases.map((mes, mesIdx) => (
              <div key={mes.mes} className={styles.mesBlock}>
                {/* Month Header */}
                <div className={styles.mesHeader}>
                  <div className={styles.mesLabel}>
                    <span className={styles.mesName}>{mes.mes}</span>
                    <span className={styles.mesFase}>{mes.fase}</span>
                  </div>
                </div>

                {/* Activities List */}
                <div className={styles.actividadesList}>
                  {mes.actividades.map((act: any, actIdx: number) => {
                    const status = statuses[mesIdx]?.[actIdx] || 'pendente';
                    return (
                      <div 
                        key={actIdx} 
                        className={`${styles.actividadeCard} ${styles[`status-${status}`]}`}
                      >
                        <div className={styles.actData}>
                          <span className={styles.actDia}>{act.dia}</span>
                          {status === 'concluido' && (
                            <i className="ti ti-circle-check" title={t('legend.concluido')}></i>
                          )}
                          {status === 'em-curso' && (
                            <i className="ti ti-clock-play" title={t('legend.emCurso')}></i>
                          )}
                        </div>
                        <div className={styles.actContent}>
                          <h3 className={styles.actTitle}>{act.titulo}</h3>
                          <p className={styles.actDesc}>{act.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.legendWrapper}>
            <h4 className={styles.legendTitle}>{t('legend.title')}</h4>
            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.dotConcluido}`}></div>
                <span>{t('legend.concluido')}</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.dotEmCurso}`}></div>
                <span>{t('legend.emCurso')}</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.dotPendente}`}></div>
                <span>{t('legend.pendente')}</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.dotDestaque}`}></div>
                <span>{t('legend.evento')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
