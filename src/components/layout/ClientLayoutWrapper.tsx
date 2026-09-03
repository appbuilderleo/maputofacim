'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Ocultar Navbar e Footer nos painéis com Sidebar
  const isDashboardPage = 
    pathname.includes('/admin') || 
    pathname.includes('/expositor/dashboard') || 
    pathname.includes('/patrocinador/dashboard');

  // Página inicial SPA tem seu próprio topo, menu e rodapé dedicados
  const isHomePage = pathname === '/' || pathname === '/pt' || pathname === '/en';

  if (isHomePage) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    );
  }

  return (
    <>
      {!isDashboardPage && <Header />}
      
      <main style={{ 
        paddingTop: isDashboardPage ? '0' : 'var(--header-height)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>
      
      {!isDashboardPage && <Footer />}
    </>
  );
}
