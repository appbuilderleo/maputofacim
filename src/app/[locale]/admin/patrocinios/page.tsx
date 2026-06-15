import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default async function AdminPatrociniosPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  // Fetch all patrocinios
  const patrocinios = await prisma.patrocinio.findMany({
    include: {
      empresa: true,
      pacote: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            Gestão de Patrocínios
          </h1>
          <p style={{ color: 'var(--facim-gray-500)' }}>
            Lista de intenções e patrocínios confirmados para o evento.
          </p>
        </div>
        <div>
          <button className="btn btn-secondary">
            <i className="ti ti-download" aria-hidden="true"></i> Exportar Lista
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--facim-gray-200)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--facim-gray-200)', background: '#FAFAFA', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <input type="text" placeholder="Pesquisar Patrocinador..." className="form-input" style={{ maxWidth: '300px' }} />
          <select className="form-select" style={{ maxWidth: '200px' }}>
            <option value="">Todos os Estados</option>
            <option value="INTERESSE">Interesse</option>
            <option value="APROVADO">Aprovados</option>
            <option value="CONFIRMADO">Confirmados</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--facim-gray-200)', textAlign: 'left', color: 'var(--facim-gray-500)', background: 'white' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Empresa Patrocinadora</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Pacote Escolhido</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Data de Solicitação</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600 }}>Acções</th>
              </tr>
            </thead>
            <tbody>
              {patrocinios.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--facim-gray-400)' }}>
                    Nenhum pedido de patrocínio registado.
                  </td>
                </tr>
              ) : (
                patrocinios.map(pat => (
                  <tr key={pat.id} style={{ borderBottom: '1px solid var(--facim-gray-100)' }}>
                    <td data-label="Empresa Patrocinadora" style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--facim-dark)' }}>{pat.empresa.nome}</div>
                      <div style={{ fontSize: '12px', color: 'var(--facim-gray-400)' }}>NUIT: {pat.empresa.nuit}</div>
                    </td>
                    <td data-label="Pacote Escolhido" style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        <i className="ti ti-star" style={{ color: 'var(--facim-gold)' }}></i>
                        <span style={{ fontWeight: 600, color: 'var(--facim-dark)' }}>{pat.pacote.nome}</span>
                      </div>
                    </td>
                    <td data-label="Estado" style={{ padding: '16px 24px' }}>
                      <span className={`badge ${pat.estado === 'CONFIRMADO' || pat.estado === 'APROVADO' ? 'badge-teal' : pat.estado === 'REJEITADO' ? 'badge-danger' : 'badge-orange'}`}>
                        {pat.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td data-label="Data de Solicitação" style={{ padding: '16px 24px', color: 'var(--facim-gray-500)' }}>
                      {pat.dataSolicitacao.toLocaleDateString('pt-PT')}
                    </td>
                    <td data-label="Acções" style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <Link href={`/admin/patrocinios/${pat.id}`} className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                        <i className="ti ti-eye" style={{ fontSize: '18px' }}></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
