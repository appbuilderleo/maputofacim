'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import styles from './page.module.css';
import { useTranslations } from 'next-intl';
import SponsorsCarousel from '@/components/SponsorsCarousel';

// ── Countdown Hook ─────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// Data arrays moved inside HomePage component for i18n

import { useMemo } from 'react';

const heroImages = [
  '/hero/1%20(1).png',
  '/hero/1%20(3).png',
  '/hero/1%20(5).png',
  '/hero/1%20(8).png',
];

export default function HomePage() {
  const facimDate = useMemo(() => new Date(process.env.NEXT_PUBLIC_FACIM_DATE || '2026-08-25T08:00:00+02:00'), []);
  const countdown = useCountdown(facimDate);
  const tHero = useTranslations('Home.Hero');
  const tStats = useTranslations('Home.Stats');
  const tAbout = useTranslations('Home.About');
  const tFeatures = useTranslations('Home.Features');
  const tSponsors = useTranslations('Home.Sponsors');
  const tCTA = useTranslations('Home.CTA');

  const stats = [
    { value: '250+', label: tStats('exhibitors'), icon: 'ti-building-store' },
    { value: '8', label: tStats('districts'), icon: 'ti-map-pin' },
    { value: '15+', label: tStats('sectors'), icon: 'ti-category' },
    { value: '50K+', label: tStats('visitors'), icon: 'ti-users' },
  ];

  const features = [
    {
      icon: 'ti-building-store',
      title: tFeatures('items.digital.title'),
      desc: tFeatures('items.digital.desc'),
      accent: 'orange',
    },
    {
      icon: 'ti-star',
      title: tFeatures('items.sponsorships.title'),
      desc: tFeatures('items.sponsorships.desc'),
      accent: 'gold',
    },
    {
      icon: 'ti-calendar-event',
      title: tFeatures('items.schedule.title'),
      desc: tFeatures('items.schedule.desc'),
      accent: 'teal',
    },
    {
      icon: 'ti-chart-bar',
      title: tFeatures('items.dashboard.title'),
      desc: tFeatures('items.dashboard.desc'),
      accent: 'blue',
    },
  ];

  const packages = [
    { nome: 'Platinum', icon: '💎', color: '#534AB7', bgClass: 'pkgPlatinum', desc: tSponsors('packages.platinum') },
    { nome: 'Gold', icon: '🥇', color: '#7A4A00', bgClass: 'pkgGold', desc: tSponsors('packages.gold') },
    { nome: 'Silver', icon: '🥈', color: '#5F5E5A', bgClass: 'pkgSilver', desc: tSponsors('packages.silver') },
    { nome: 'Bronze', icon: '🥉', color: '#C87840', bgClass: 'pkgBronze', desc: tSponsors('packages.bronze') },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ════════ HERO SECTION ════════ */}
      <section className={styles.hero}>
        <div className={styles.heroSlider}>
          {heroImages.map((img, index) => (
            <div
              key={img}
              className={`${styles.heroSlide} ${index === currentSlide ? styles.heroSlideActive : ''}`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroDeco}></div>
        <div className={styles.heroDeco2}></div>
        <div className={styles.heroDeco3}></div>

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>{tHero('eyebrow')}</span>
            <h1 className={styles.heroTitle}>
              {tHero('title')} <span className={styles.heroHighlight}>{tHero('highlight')}</span>
            </h1>
            <p className={styles.heroSub}>
              {tHero('subtitle')}
            </p>

            <div className={styles.heroActions}>
              <Link href="/expositor/registar" className="btn btn-primary btn-lg">
                <i className="ti ti-building-store" aria-hidden="true"></i>
                {tHero('registerBtn')}
              </Link>
              <Link href="/sobre" className="btn btn-white">
                {tHero('learnMoreBtn')}
              </Link>
            </div>

            {/* Countdown */}
            <div className={styles.countdown}>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNum}>{String(countdown.days).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>{tHero('days')}</span>
              </div>
              <div className={styles.countdownSep}>:</div>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNum}>{String(countdown.hours).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>{tHero('hours')}</span>
              </div>
              <div className={styles.countdownSep}>:</div>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNum}>{String(countdown.minutes).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>{tHero('minutes')}</span>
              </div>
              <div className={styles.countdownSep}>:</div>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNum}>{String(countdown.seconds).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>{tHero('seconds')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <section className={styles.statsBar}>
        <div className={styles.statsContainer}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <i className={`ti ${stat.icon} ${styles.statIcon}`} aria-hidden="true"></i>
              <div>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ SPONSORS CAROUSEL ════════ */}
      <SponsorsCarousel />

      {/* ════════ ABOUT PREVIEW ════════ */}
      <section className={styles.aboutSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className="t-eyebrow">{tAbout('eyebrow')}</span>
              <h2 className={styles.sectionHeading}>
                {tAbout('title')}
              </h2>
              <p className={styles.aboutDesc}>
                {tAbout('p1')}
              </p>
              <p className={styles.aboutDesc}>
                {tAbout('p2')}
              </p>
              <Link href="/sobre" className="btn btn-secondary" style={{ marginTop: '8px' }}>
                {tAbout('btn')}
              </Link>
            </div>
            <div className={styles.aboutVisual}>
              <div className={styles.aboutCard}>
                <div className={styles.aboutCardIcon}>
                  <i className="ti ti-target" aria-hidden="true"></i>
                </div>
                <h3>{tAbout('objectiveTitle')}</h3>
                <p>{tAbout('objectiveDesc')}</p>
              </div>
              <div className={styles.aboutCard}>
                <div className={styles.aboutCardIcon} style={{ background: '#FFF0C8', color: '#7A4A00' }}>
                  <i className="ti ti-rocket" aria-hidden="true"></i>
                </div>
                <h3>{tAbout('impactTitle')}</h3>
                <p>{tAbout('impactDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className="t-eyebrow">{tFeatures('eyebrow')}</span>
            <h2 className={styles.sectionHeading}>{tFeatures('title')}</h2>
            <p className={styles.sectionSub}>
              {tFeatures('subtitle')}
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={`${styles.featureCard} ${styles[`featureCard${feature.accent}`]}`}>
                <div className={`${styles.featureIcon} ${styles[`featureIcon${feature.accent}`]}`}>
                  <i className={`ti ${feature.icon}`} aria-hidden="true"></i>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SPONSORS SECTION ════════ */}
      <section className={styles.sponsorsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className="t-eyebrow">{tSponsors('eyebrow')}</span>
            <h2 className={styles.sectionHeading}>{tSponsors('title')}</h2>
            <p className={styles.sectionSub}>
              {tSponsors('subtitle')}
            </p>
          </div>

          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div key={pkg.nome} className={`${styles.packageCard} ${styles[pkg.bgClass]}`}>
                <span className={styles.packageIcon}>{pkg.icon}</span>
                <span className={styles.packageName} style={{ color: pkg.color }}>{pkg.nome}</span>
                <span className={styles.packageDesc}>{pkg.desc}</span>
              </div>
            ))}
          </div>

          <div className={styles.sponsorsCta}>
            <Link href="/patrocinadores" className="btn btn-gold">
              <i className="ti ti-star" aria-hidden="true"></i>
              {tSponsors('btn')}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ CTA SECTION ════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <span className="t-eyebrow" style={{ color: 'var(--facim-gold-light)' }}>
                {tCTA('eyebrow')}
              </span>
              <h2 className={styles.ctaTitle}>
                {tCTA('title')}
              </h2>
              <p className={styles.ctaDesc}>
                {tCTA('desc')}
              </p>
              <div className={styles.ctaActions}>
                <Link href="/expositor/registar" className="btn btn-primary btn-lg">
                  <i className="ti ti-building-store" aria-hidden="true"></i>
                  {tCTA('registerBtn')}
                </Link>
                <Link href="/contactos" className="btn btn-white">
                  {tCTA('contactBtn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
