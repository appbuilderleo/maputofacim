'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardTopBar({ user, basePath }: { user: { name: string; role: string }, basePath: string }) {
  const [open, setOpen] = useState(false);

  // Fecha o menu lateral se a janela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        document.body.classList.remove('sidebar-open');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-open');
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={() => document.body.classList.remove('sidebar-open')}></div>
      <div style={{
        height: '70px',
        background: 'white',
        borderBottom: '1px solid var(--facim-gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            className="hide-desktop"
            onClick={toggleSidebar}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--facim-dark)', marginRight: '16px', display: 'flex', alignItems: 'center' }}
            aria-label="Toggle Sidebar"
          >
            <i className="ti ti-menu-2"></i>
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setOpen(!open)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'right' }} className="hide-mobile">
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--facim-dark)', margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--facim-gray-500)', margin: 0, textTransform: 'capitalize' }}>{user.role.toLowerCase()}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--facim-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <i className="ti ti-chevron-down hide-mobile" style={{ color: 'var(--facim-gray-500)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}></i>
          </button>

          {open && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'white',
              border: '1px solid var(--facim-gray-200)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              width: '200px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Link 
                href={`${basePath}/perfil`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', color: 'var(--facim-dark)', textDecoration: 'none', fontSize: '14px', borderBottom: '1px solid var(--facim-gray-100)' }}
              >
                <i className="ti ti-user"></i> Meu Perfil
              </Link>
              <button 
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                    window.location.href = '/expositor/login';
                  });
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', color: 'var(--facim-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}
              >
                <i className="ti ti-logout"></i> Terminar Sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
