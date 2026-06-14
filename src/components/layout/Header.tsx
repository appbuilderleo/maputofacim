'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { NAV_LINKS } from '@/lib/constants';
import styles from './Header.module.css';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Header');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="A Caminho da FACIM" style={{ height: '40px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className={styles.desktopActions}>
          <LanguageSwitcher />
          <Link href="/expositor/login" className={styles.loginLink}>
            {t('login')}
          </Link>
          <Link href="/expositor/registar" className="btn btn-primary btn-sm">
            {t('register')}
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          id="menu-toggle"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayActive : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <nav
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuActive : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuTitle}>Menu</span>
          <button
            className={styles.mobileClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <div className={styles.mobileMenuLinks}>
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <span className={styles.mobileNavArrow}>→</span>
            </Link>
          ))}
        </div>

        <div className={styles.mobileMenuActions}>
          <Link
            href="/expositor/login"
            className="btn btn-secondary btn-block"
            onClick={() => setMenuOpen(false)}
          >
            {t('login')}
          </Link>
          <Link
            href="/expositor/registar"
            className="btn btn-primary btn-block"
            onClick={() => setMenuOpen(false)}
          >
            {t('registerCompany')}
          </Link>
        </div>

        <div className={styles.mobileMenuFooter}>
          <p className={styles.mobileMenuContact}>
            Direcção Provincial da Indústria e Comércio
          </p>
          <p className={styles.mobileMenuContact}>
            Província de Maputo
          </p>
        </div>
      </nav>
    </header>
  );
}
