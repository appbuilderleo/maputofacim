import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Sobre a Campanha',
  description: 'Conheça a campanha de preparação da Província de Maputo para a 61ª Edição da FACIM 2026.',
};

import { useTranslations } from 'next-intl';

export default function SobrePage() {
  const t = useTranslations('Sobre');
  const tObj = useTranslations('Sobre.objectives');
  const tTime = useTranslations('Sobre.timeline');

  const objectives = [
    {
      icon: 'ti-device-laptop',
      title: tObj('items.0.title'),
      desc: tObj('items.0.desc'),
    },
    {
      icon: 'ti-building-store',
      title: tObj('items.1.title'),
      desc: tObj('items.1.desc'),
    },
    {
      icon: 'ti-star',
      title: tObj('items.2.title'),
      desc: tObj('items.2.desc'),
    },
    {
      icon: 'ti-speakerphone',
      title: tObj('items.3.title'),
      desc: tObj('items.3.desc'),
    },
    {
      icon: 'ti-folder',
      title: tObj('items.4.title'),
      desc: tObj('items.4.desc'),
    },
    {
      icon: 'ti-chart-pie',
      title: tObj('items.5.title'),
      desc: tObj('items.5.desc'),
    },
  ];

  const timeline = [
    { phase: tTime('phases.0.phase'), title: tTime('phases.0.title'), period: tTime('phases.0.period'), status: 'active' },
    { phase: tTime('phases.1.phase'), title: tTime('phases.1.title'), period: tTime('phases.1.period'), status: 'upcoming' },
    { phase: tTime('phases.2.phase'), title: tTime('phases.2.title'), period: tTime('phases.2.period'), status: 'upcoming' },
    { phase: tTime('phases.3.phase'), title: tTime('phases.3.title'), period: tTime('phases.3.period'), status: 'upcoming' },
  ];


  return (
    <>
      {/* Hero */}
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

      {/* Mission */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div>
              <span className="t-eyebrow">{t('mission.eyebrow')}</span>
              <h2 className={styles.sectionTitle}>{t('mission.title')}</h2>
              <p className={styles.bodyText}>
                {t('mission.p1')}
              </p>
              <p className={styles.bodyText}>
                {t('mission.p2')}
              </p>
            </div>
            <div className={styles.missionStats}>
              <div className={styles.missionStat}>
                <span className={styles.missionStatNum}>61ª</span>
                <span className={styles.missionStatLabel}>{t('mission.stats.edition')}</span>
              </div>
              <div className={styles.missionStat}>
                <span className={styles.missionStatNum}>8</span>
                <span className={styles.missionStatLabel}>{t('mission.stats.districts')}</span>
              </div>
              <div className={styles.missionStat}>
                <span className={styles.missionStatNum}>250+</span>
                <span className={styles.missionStatLabel}>{t('mission.stats.companies')}</span>
              </div>
              <div className={styles.missionStat}>
                <span className={styles.missionStatNum}>15+</span>
                <span className={styles.missionStatLabel}>{t('mission.stats.sectors')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className={styles.objectivesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className="t-eyebrow">{tObj('eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{tObj('title')}</h2>
          </div>
          <div className={styles.objectivesGrid}>
            {objectives.map((obj) => (
              <div key={obj.title} className={styles.objectiveCard}>
                <div className={styles.objectiveIcon}>
                  <i className={`ti ${obj.icon}`} aria-hidden="true"></i>
                </div>
                <h3>{obj.title}</h3>
                <p>{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className="t-eyebrow">{tTime('eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{tTime('title')}</h2>
          </div>
          <div className={styles.timelineGrid}>
            {timeline.map((item, i) => (
              <div key={i} className={`${styles.timelineItem} ${item.status === 'active' ? styles.timelineActive : ''}`}>
                <div className={styles.timelineDot}></div>
                <span className={styles.timelinePhase}>{item.phase}</span>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <span className={styles.timelinePeriod}>{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization */}
      <section className={styles.orgSection}>
        <div className={styles.container}>
          <div className={styles.orgCard}>
            <div className={styles.orgIcon}>🏛️</div>
            <h2>{t('org.name')}</h2>
            <p className={styles.orgSub}>{t('org.sub')}</p>
            <p className={styles.orgDesc}>
              {t('org.desc')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
