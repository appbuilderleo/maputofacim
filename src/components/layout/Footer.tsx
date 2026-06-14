import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <div className={styles.logo}>
                <img src="/logo.png" alt="A Caminho da FACIM" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
              <p className={styles.brandDesc}>
                Plataforma de Gestão e Promoção da Participação da 
                Província de Maputo na 61ª Edição da FACIM 2026.
              </p>
              <div className={styles.dividerGradient}></div>
            </div>

            {/* Navigation */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Navegação</h4>
              <ul className={styles.linksList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Participar */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Participar</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/expositor/registar" className={styles.footerLink}>
                    Inscrição de Expositor
                  </Link>
                </li>
                <li>
                  <Link href="/patrocinadores" className={styles.footerLink}>
                    Pacotes de Patrocínio
                  </Link>
                </li>
                <li>
                  <Link href="/expositor/login" className={styles.footerLink}>
                    Área do Expositor
                  </Link>
                </li>
                <li>
                  <Link href="/patrocinador/login" className={styles.footerLink}>
                    Área do Patrocinador
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Contacto</h4>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <span className={styles.contactIcon}>📍</span>
                  <span>Av. do Trabalho, Matola<br/>Província de Maputo</span>
                </li>
                <li className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <span>+258 21 720 000</span>
                </li>
                <li className={styles.contactItem}>
                  <span className={styles.contactIcon}>✉️</span>
                  <span>facim@dpic-maputo.gov.mz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Direcção Provincial da Indústria e Comércio — Província de Maputo. 
              Todos os direitos reservados.
            </p>
            <p className={styles.credits}>
              61ª Edição da FACIM · Agosto 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
