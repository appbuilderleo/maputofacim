'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ExpositorSidebar.module.css';

const EXPOSITOR_NAV = [
  { href: '/expositor/dashboard', label: 'Visão Geral', icon: 'ti-dashboard' },
  { href: '/expositor/dashboard/candidatura', label: 'Candidatura', icon: 'ti-file-description' },
  { href: '/expositor/dashboard/documentos', label: 'Documentos', icon: 'ti-files' },
  { href: '/expositor/dashboard/perfil', label: 'Perfil da Empresa', icon: 'ti-building-store' },
];

import { useEffect } from 'react';

export default function ExpositorSidebar() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove('sidebar-open');
  }, [pathname]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src="/logo.png" alt="FACIM Logo" style={{ height: '32px', marginBottom: '8px', objectFit: 'contain' }} />
        <h2>Área do Expositor</h2>
        <p>FACIM 2026</p>
      </div>

      <nav className={styles.sidebarNav}>
        {EXPOSITOR_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <i className={`ti ${item.icon} ${styles.navIcon}`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={() => {
          fetch('/api/auth/logout', { method: 'POST' }).then(() => {
            window.location.href = '/expositor/login';
          });
        }}>
          <i className="ti ti-logout" aria-hidden="true"></i>
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
