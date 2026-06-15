import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default async function AdminExpositoresPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  // Fetch all companies and their applications
  const empresas = await prisma.empresa.findMany({
    include: {
      candidatura: true,
      user: {
        select: { email: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            Gestão de Expositores
          </h1>
          <p style={{ color: 'var(--facim-gray-500)' }}>
            Lista de empresas registadas e estado das suas candidaturas.
          </p>
        </div>
        <div>
          <a href="/api/export/expositores" download className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <i className="ti ti-download" aria-hidden="true"></i> Exportar Lista
          </a>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--facim-gray-200)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--facim-gray-200)', background: '#FAFAFA', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <input type="text" placeholder="Pesquisar por NUIT ou Empresa..." className="form-input" style={{ maxWidth: '300px' }} />
          <select className="form-select" style={{ maxWidth: '200px' }}>
            <option value="">Todos os Estados</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="APROVADA">Aprovados</option>
            <option value="REJEITADA">Rejeitados</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--facim-gray-200)', textAlign: 'left', color: 'var(--facim-gray-500)', background: 'white' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Empresa</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Sector</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Distrito</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Estado Candidatura</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600 }}>Acções</th>
              </tr>
            </thead>
            <tbody>
              {empresas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--facim-gray-400)' }}>
                    Nenhuma empresa registada.
                  </td>
                </tr>
              ) : (
                empresas.map(empresa => (
                  <tr key={empresa.id} style={{ borderBottom: '1px solid var(--facim-gray-100)' }}>
                    <td data-label="Empresa" style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--facim-dark)' }}>{empresa.nome}</div>
                      <div style={{ fontSize: '12px', color: 'var(--facim-gray-400)' }}>NUIT: {empresa.nuit}</div>
                    </td>
                    <td data-label="Sector" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)' }}>{empresa.sectorActividade}</td>
                    <td data-label="Distrito" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)' }}>{empresa.distrito}</td>
                    <td data-label="Estado Candidatura" style={{ padding: '16px 24px' }}>
                      {!empresa.candidatura ? (
                        <span className="badge badge-gray">Não Iniciada</span>
                      ) : (
                        <span className={`badge ${empresa.candidatura.estado === 'APROVADA' ? 'badge-teal' : empresa.candidatura.estado === 'PENDENTE' ? 'badge-orange' : 'badge-gray'}`}>
                          {empresa.candidatura.estado}
                        </span>
                      )}
                    </td>
                    <td data-label="Acções" style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <Link href={`/admin/expositores/${empresa.id}`} className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                        <i className="ti ti-eye" style={{ fontSize: '18px' }}></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--facim-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--facim-gray-500)' }}>
          <span>Mostrando {empresas.length} resultados</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-white btn-sm" disabled>Anterior</button>
            <button className="btn btn-white btn-sm" disabled>Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
