'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../expositor/layout.module.css';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'ti-dashboard' },
  { href: '/admin/expositores', label: 'Expositores', icon: 'ti-building-store' },
  { href: '/admin/patrocinios', label: 'Patrocínios', icon: 'ti-star' },
  { href: '/admin/noticias', label: 'Notícias', icon: 'ti-news' },
  { href: '/admin/galeria', label: 'Galeria', icon: 'ti-photo' },
  { href: '/admin/relatorios', label: 'Relatórios', icon: 'ti-report' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '260px',
      background: '#0F2440',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src="/logo.png" alt="FACIM Logo" style={{ height: '32px', marginBottom: '8px', objectFit: 'contain' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>Administração</h2>
        <p style={{ fontSize: '12px', color: 'var(--facim-gold)', fontWeight: 600 }}>DPIC Maputo</p>
      </div>

      <nav style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
        {ADMIN_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--facim-gold)' : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: '20px', color: isActive ? 'var(--facim-gold)' : 'inherit' }} aria-hidden="true"></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => {
            fetch('/api/auth/logout', { method: 'POST' }).then(() => {
              window.location.href = '/expositor/login';
            });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px 0' }}
        >
          <i className="ti ti-logout" style={{ fontSize: '18px' }} aria-hidden="true"></i>
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
