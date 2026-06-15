import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default async function AdminDashboard() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  // Estatísticas Rápidas
  const totalExpositores = await prisma.user.count({ where: { role: 'EXPOSITOR' } });
  const candidaturasAprovadas = await prisma.candidatura.count({ where: { estado: 'APROVADA' } });
  const candidaturasPendentes = await prisma.candidatura.count({ where: { estado: 'PENDENTE' } });
  const patrocinadores = await prisma.patrocinio.count({ where: { estado: 'CONFIRMADO' } });

  return (
    <div style={{ padding: '32px', background: 'var(--facim-off-white)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            Painel Administrativo
          </h1>
          <p style={{ color: 'var(--facim-gray-500)' }}>
            Bem-vindo, {user.name}. Visão geral do estado da FACIM 2026.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/noticias" className="btn btn-ghost">Acesso ao Site</Link>
          <button className="btn btn-primary">
            Exportar Relatório
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* KPI 1 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)', borderTop: '3px solid var(--facim-orange)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--facim-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Total Expositores</span>
            <i className="ti ti-users" style={{ fontSize: '24px', color: 'var(--facim-gray-400)' }}></i>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'var(--facim-dark)' }}>{totalExpositores}</span>
        </div>

        {/* KPI 2 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)', borderTop: '3px solid var(--facim-teal)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--facim-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Candidaturas Aprovadas</span>
            <i className="ti ti-check" style={{ fontSize: '24px', color: 'var(--facim-gray-400)' }}></i>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'var(--facim-dark)' }}>{candidaturasAprovadas}</span>
        </div>

        {/* KPI 3 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)', borderTop: '3px solid var(--facim-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--facim-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Por Analisar</span>
            <i className="ti ti-clock" style={{ fontSize: '24px', color: 'var(--facim-gray-400)' }}></i>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'var(--facim-dark)' }}>{candidaturasPendentes}</span>
        </div>

        {/* KPI 4 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)', borderTop: '3px solid var(--facim-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--facim-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Patrocinadores</span>
            <i className="ti ti-star" style={{ fontSize: '24px', color: 'var(--facim-gray-400)' }}></i>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'var(--facim-dark)' }}>{patrocinadores}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '24px' }}>Candidaturas Recentes</h2>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--facim-gray-200)', textAlign: 'left', color: 'var(--facim-gray-500)' }}>
                <th style={{ padding: '12px 8px' }}>Empresa</th>
                <th style={{ padding: '12px 8px' }}>Sector</th>
                <th style={{ padding: '12px 8px' }}>Estado</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Acção</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--facim-gray-400)' }}>Nenhuma candidatura pendente de momento.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '24px' }}>Acessos Rápidos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/admin/expositores" className="btn btn-white" style={{ justifyContent: 'flex-start' }}>
              <i className="ti ti-building-store" style={{ marginRight: '8px' }}></i> Gestão de Expositores
            </Link>
            <Link href="/admin/patrocinios" className="btn btn-white" style={{ justifyContent: 'flex-start' }}>
              <i className="ti ti-star" style={{ marginRight: '8px', color: 'var(--facim-gold)' }}></i> Gestão de Patrocínios
            </Link>
            <Link href="/admin/noticias" className="btn btn-white" style={{ justifyContent: 'flex-start' }}>
              <i className="ti ti-news" style={{ marginRight: '8px' }}></i> Publicar Notícia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
