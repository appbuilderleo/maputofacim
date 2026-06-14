import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminRelatoriosPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  // Get some high-level metrics for the report
  const totalEmpresas = await prisma.empresa.count();
  const candidaturasAprovadas = await prisma.candidatura.count({ where: { estado: 'APROVADA' } });
  
  // Group by sector
  const empresasPorSector = await prisma.empresa.groupBy({
    by: ['sectorActividade'],
    _count: { _all: true }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            Relatórios e Exportação
          </h1>
          <p style={{ color: 'var(--facim-gray-500)' }}>
            Gere relatórios operacionais ou exporte dados para Excel/PDF.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Export Card 1 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--facim-off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-teal)' }}>
              <i className="ti ti-file-spreadsheet" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Lista de Expositores</h3>
              <p style={{ fontSize: '12px', color: 'var(--facim-gray-500)' }}>Todas as empresas e contactos</p>
            </div>
          </div>
          <a href="/api/export/expositores" download className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
            <i className="ti ti-download" aria-hidden="true"></i> Descarregar CSV
          </a>
        </div>

        {/* Export Card 2 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--facim-off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-gold)' }}>
              <i className="ti ti-file-analytics" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Patrocinadores</h3>
              <p style={{ fontSize: '12px', color: 'var(--facim-gray-500)' }}>Pacotes escolhidos e facturação</p>
            </div>
          </div>
          <a href="/api/export/patrocinadores" download className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
            <i className="ti ti-download" aria-hidden="true"></i> Descarregar Excel (CSV)
          </a>
        </div>

        {/* Export Card 3 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--facim-off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-orange)' }}>
              <i className="ti ti-file-description" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Mapa de Stands</h3>
              <p style={{ fontSize: '12px', color: 'var(--facim-gray-500)' }}>Reservas de área confirmadas</p>
            </div>
          </div>
          <a href="/api/export/mapa" download className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
            <i className="ti ti-download" aria-hidden="true"></i> Lista de Ocupação (CSV)
          </a>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '24px' }}>
          Resumo Executivo (Preview)
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          <div>
            <div style={{ padding: '16px', background: 'var(--facim-off-white)', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--facim-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Total de Registos</span>
              <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--facim-dark)' }}>{totalEmpresas} Empresas</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(56, 178, 172, 0.1)', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--facim-teal)', textTransform: 'uppercase', fontWeight: 600 }}>Aprovações (Expositores)</span>
              <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--facim-teal)' }}>{candidaturasAprovadas} Confirmados</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--facim-gray-600)', marginBottom: '16px' }}>Distribuição por Sector</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {empresasPorSector.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--facim-gray-400)' }}>Sem dados suficientes para gerar gráfico.</p>
              ) : (
                empresasPorSector.map((sector, idx) => {
                  const percentage = Math.round((sector._count._all / totalEmpresas) * 100) || 0;
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--facim-dark)', fontWeight: 500 }}>{sector.sectorActividade}</span>
                        <span style={{ color: 'var(--facim-gray-500)' }}>{sector._count._all} ({percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--facim-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--facim-gold)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
