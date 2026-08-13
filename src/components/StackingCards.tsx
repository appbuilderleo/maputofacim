'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';
import styles from './StackingCards.module.css';

interface ProjectData {
  nome: string;
  beneficios: string[];
  link: string;
  color: string;
  url: string;
}

interface CardProps {
  i: number;
  title: string;
  beneficios: string[];
  link: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const Card = ({
  i,
  title,
  beneficios,
  link,
  url,
  color,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className={styles.cardContainer}>
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-10% + ${i * 25}px)`,
        }}
        className={styles.cardBody}
      >
        <h2 className={styles.cardTitle} style={{ color: 'white' }}>{title}</h2>
        <div className={styles.cardContent}>
          <div className={styles.cardLeft}>
            <ul className={styles.cardBenefits}>
              {beneficios.map((b, idx) => (
                <li key={idx} style={{ color: 'white' }}>
                  <i className="ti ti-check" aria-hidden="true"></i>
                  {b}
                </li>
              ))}
            </ul>
            <a href={link} className={styles.cardLink} style={{ color: 'white', textDecoration: 'none' }}>
              <span>Ver pacote</span>
              <svg
                width='22'
                height='12'
                viewBox='0 0 22 12'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z'
                  fill='currentColor'
                />
              </svg>
            </a>
          </div>

          <div className={styles.cardRight}>
            <motion.div className={styles.cardImageWrapper} style={{ scale: imageScale }}>
              <img src={url} alt={title} className={styles.cardImage} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ComponentRootProps {
  projects: ProjectData[];
}

const StackingCards = forwardRef<HTMLElement, ComponentRootProps>(({ projects }, ref) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root>
      <div className={styles.main} ref={container}>
        <section className={styles.introSection}>
          <div className={styles.gridBackground}></div>
          <div className={styles.introContent}>
            <h1 className={styles.introTitle}>
              Descubra os <br /> Pacotes de Patrocínio
            </h1>
          </div>
        </section>

        <section className={styles.cardsSection}>
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                link={project.link}
                url={project.url}
                title={project.nome}
                color={project.color}
                beneficios={project.beneficios}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </div>
    </ReactLenis>
  );
});

StackingCards.displayName = 'StackingCards';

export default StackingCards;
