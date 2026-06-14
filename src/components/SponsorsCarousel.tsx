'use client';

import styles from './SponsorsCarousel.module.css';

const SPONSORS = [
  { name: 'Standard Bank', logo: 'ti-building-bank' },
  { name: 'Vodacom', logo: 'ti-device-mobile' },
  { name: 'Cervejas de Moçambique', logo: 'ti-glass-full' },
  { name: 'TMcel', logo: 'ti-wifi' },
  { name: 'BCI', logo: 'ti-building' },
  { name: 'FNB Moçambique', logo: 'ti-wallet' },
  { name: 'Absa', logo: 'ti-credit-card' },
  { name: 'Portos e Caminhos de Ferro', logo: 'ti-train' },
];

export default function SponsorsCarousel() {
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        {/* Renderizamos a lista duas vezes para criar o loop infinito (marquee) */}
        {[...SPONSORS, ...SPONSORS].map((sponsor, index) => (
          <div key={index} className={styles.sponsorItem}>
            <i className={`ti ${sponsor.logo} ${styles.sponsorIcon}`}></i>
            <span className={styles.sponsorName}>{sponsor.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
