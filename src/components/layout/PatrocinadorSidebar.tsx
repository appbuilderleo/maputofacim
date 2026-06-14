'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../expositor/layout.module.css'; // Podemos reutilizar o CSS base do dashboard

const PATROCINADOR_NAV = [
  { href: '/patrocinador/dashboard', label: 'Visão Geral', icon: 'ti-dashboard' },
  { href: '/patrocinador/dashboard/pacote', label: 'Meu Pacote', icon: 'ti-star' },
  { href: '/patrocinador/dashboard/beneficios', label: 'Benefícios', icon: 'ti-gift' },
];

export default function PatrocinadorSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '260px',
      background: 'white',
      borderRight: '1px solid var(--facim-gray-200)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--facim-gray-200)' }}>
        <img src="/logo.png" alt="FACIM Logo" style={{ height: '32px', marginBottom: '8px', objectFit: 'contain' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--facim-dark)', marginBottom: '2px' }}>Área do Patrocinador</h2>
        <p style={{ fontSize: '12px', color: 'var(--facim-gold)', fontWeight: 600 }}>FACIM 2026</p>
      </div>

      <nav style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
        {PATROCINADOR_NAV.map((item) => {
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
                color: isActive ? 'var(--facim-gold)' : 'var(--facim-gray-600)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--badge-gold-bg)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--facim-gold)' : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: '20px' }} aria-hidden="true"></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--facim-gray-200)' }}>
        <button 
          onClick={() => {
            fetch('/api/auth/logout', { method: 'POST' }).then(() => {
              window.location.href = '/patrocinador/login';
            });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'none', border: 'none', color: 'var(--facim-gray-500)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px 0' }}
        >
          <i className="ti ti-logout" style={{ fontSize: '18px' }} aria-hidden="true"></i>
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
