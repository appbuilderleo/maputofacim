import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import RealTimeRefresher from '@/components/RealTimeRefresher';

export default async function ExpositorDashboardOverview() {
  const user = await getSessionUser();
  
  if (!user) return null;

  // Fetch company data and applications
  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id },
    include: {
      candidatura: true,
      documentos: true,
    }
  });

  if (!empresa) {
    return (
      <div>
        <div className="alert alert-warning">
          <i className="ti ti-alert-triangle alert-icon" aria-hidden="true"></i>
          <div>
            <div className="alert-title">Empresa não encontrada</div>
            <div className="alert-text">Não encontrámos o perfil da sua empresa. Por favor, contacte o suporte.</div>
          </div>
        </div>
      </div>
    );
  }

  const estadoBadgeClass = {
    RASCUNHO: 'badge-gray',
    PENDENTE: 'badge-orange',
    EM_ANALISE: 'badge-blue',
    APROVADA: 'badge-teal',
    REJEITADA: 'badge-danger',
    CANCELADA: 'badge-gray',
  }[empresa.candidatura?.estado || 'RASCUNHO'];

  return (
    <div>
      <RealTimeRefresher intervalMs={60000} />
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Olá, {user.name}
        </h1>
        <p style={{ color: 'var(--facim-gray-500)' }}>
          Bem-vindo à área reservada da empresa <strong>{empresa.nome}</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Status Card */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Estado da Candidatura</h3>
            <i className="ti ti-clipboard-text" style={{ fontSize: '24px', color: 'var(--facim-orange)' }}></i>
          </div>
          
          {empresa.candidatura ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--facim-gray-600)' }}>Estado Actual:</span>
                <span className={`badge ${estadoBadgeClass}`}>{empresa.candidatura.estado.replace('_', ' ')}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--facim-gray-500)', lineHeight: '1.6' }}>
                A sua candidatura foi submetida em {new Date(empresa.candidatura.dataSubmissao).toLocaleDateString('pt-PT')}.
              </p>
              <Link href="/expositor/dashboard/candidatura" className="btn btn-secondary btn-sm" style={{ marginTop: '16px', display: 'inline-flex' }}>
                Ver Detalhes
              </Link>
            </>
          ) : (
            <>
              <p style={{ fontSize: '14px', color: 'var(--facim-gray-600)', marginBottom: '16px' }}>
                Ainda não submeteu a sua candidatura para a FACIM 2026.
              </p>
              <Link href="/expositor/dashboard/candidatura" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                Iniciar Candidatura
              </Link>
            </>
          )}
        </div>

        {/* Profile Card */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Perfil da Empresa</h3>
            <i className="ti ti-building-store" style={{ fontSize: '24px', color: 'var(--facim-teal)' }}></i>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: '13px', color: 'var(--facim-gray-600)' }}>
            <li style={{ padding: '6px 0', borderBottom: '1px solid var(--facim-gray-100)' }}><strong>NUIT:</strong> {empresa.nuit}</li>
            <li style={{ padding: '6px 0', borderBottom: '1px solid var(--facim-gray-100)' }}><strong>Sector:</strong> {empresa.sectorActividade}</li>
            <li style={{ padding: '6px 0' }}><strong>Distrito:</strong> {empresa.distrito}</li>
          </ul>
          <Link href="/expositor/dashboard/perfil" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            Actualizar Perfil →
          </Link>
        </div>

        {/* Documents Card */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Documentação</h3>
            <i className="ti ti-files" style={{ fontSize: '24px', color: 'var(--facim-blue)' }}></i>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--facim-dark)' }}>
              {empresa.documentos.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--facim-gray-500)', lineHeight: '1.2' }}>
              Documentos<br/>Anexados
            </div>
          </div>
          
          <Link href="/expositor/dashboard/documentos" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex' }}>
            Gerir Documentos
          </Link>
        </div>
      </div>

      <div style={{ background: 'var(--badge-orange-bg)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(232, 74, 0, 0.2)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <i className="ti ti-info-circle" style={{ fontSize: '24px', color: 'var(--facim-orange)', marginTop: '2px' }}></i>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: '#902C00', marginBottom: '8px' }}>
            Próximos Passos
          </h4>
          <p style={{ fontSize: '14px', color: '#B33800', lineHeight: '1.6' }}>
            Certifique-se de que preencheu todos os dados da sua candidatura e fez o upload de documentos essenciais como o Alvará Comercial e a Certidão de Quitação antes do final do período de inscrições.
          </p>
        </div>
      </div>
    </div>
  );
}
