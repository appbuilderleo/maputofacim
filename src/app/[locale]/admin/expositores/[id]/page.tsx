import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { revalidatePath } from 'next/cache';

export default async function DetalheExpositorPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  const empresa = await prisma.empresa.findUnique({
    where: { id: params.id },
    include: {
      candidatura: true,
      documentos: true,
      user: { select: { email: true, name: true } }
    }
  });

  if (!empresa) {
    return <div>Empresa não encontrada.</div>;
  }

  const candidatura = empresa.candidatura;

  async function atualizarEstado(novoEstado: 'APROVADA' | 'REJEITADA') {
    'use server';
    if (!candidatura) return;

    await prisma.candidatura.update({
      where: { id: candidatura.id },
      data: { estado: novoEstado as any }
    });

    revalidatePath(`/admin/expositores/${empresa!.id}`);
    revalidatePath('/admin/expositores');
    revalidatePath('/admin');
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/expositores" style={{ color: 'var(--facim-gray-500)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-arrow-left"></i> Voltar à Lista
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            {empresa.nome}
          </h1>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--facim-gray-500)', fontSize: '14px' }}>
            <span><i className="ti ti-id-badge"></i> NUIT: {empresa.nuit}</span>
            <span><i className="ti ti-category"></i> {empresa.sectorActividade}</span>
            <span><i className="ti ti-map-pin"></i> {empresa.distrito}</span>
          </div>
        </div>
        
        {candidatura && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge ${candidatura.estado === 'APROVADA' ? 'badge-teal' : candidatura.estado === 'REJEITADA' ? 'badge-danger' : 'badge-orange'}`} style={{ fontSize: '14px', padding: '8px 16px', marginRight: '8px' }}>
              {candidatura.estado}
            </span>
            {candidatura.estado !== 'REJEITADA' && (
              <form action={atualizarEstado.bind(null, 'REJEITADA')}>
                <button type="submit" className="btn btn-white" style={{ color: 'var(--facim-danger)', borderColor: 'var(--facim-danger)' }}>
                  Rejeitar
                </button>
              </form>
            )}
            {candidatura.estado !== 'APROVADA' && (
              <form action={atualizarEstado.bind(null, 'APROVADA')}>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--facim-teal)', borderColor: 'var(--facim-teal)' }}>
                  Aprovar Candidatura
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Detalhes da Candidatura */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '24px', borderBottom: '1px solid var(--facim-gray-100)', paddingBottom: '12px' }}>
              Detalhes do Pedido
            </h2>
            
            {!candidatura ? (
              <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>A empresa ainda não iniciou a candidatura.</p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Tipo de Stand</span>
                    <div style={{ fontSize: '15px', color: 'var(--facim-dark)', marginTop: '4px', fontWeight: 500 }}>
                      {candidatura.tipoStand?.replace('_', ' ') || 'Não especificado'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Área Desejada</span>
                    <div style={{ fontSize: '15px', color: 'var(--facim-dark)', marginTop: '4px', fontWeight: 500 }}>
                      {candidatura.areaDesejada ? `${candidatura.areaDesejada} m²` : 'Não especificado'}
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Produtos a Expor</span>
                  <p style={{ fontSize: '14px', color: 'var(--facim-gray-600)', marginTop: '4px', background: 'var(--facim-off-white)', padding: '12px', borderRadius: '8px' }}>
                    {candidatura.produtosExibir || 'Nenhum produto detalhado.'}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Necessidades Específicas</span>
                  <p style={{ fontSize: '14px', color: 'var(--facim-gray-600)', marginTop: '4px', background: 'var(--facim-off-white)', padding: '12px', borderRadius: '8px' }}>
                    {candidatura.necessidades || 'Nenhuma necessidade extra solicitada.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Contactos */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)', marginBottom: '16px' }}>
              Contactos
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: 'var(--facim-gray-600)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><strong>Responsável:</strong> {empresa.user.name}</li>
              <li><strong>Email:</strong> {empresa.email}</li>
              <li><strong>Telefone:</strong> {empresa.telefone}</li>
            </ul>
          </div>

          {/* Documentos */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)', marginBottom: '16px' }}>
              Documentos Anexados ({empresa.documentos.length})
            </h2>
            {empresa.documentos.length === 0 ? (
              <p style={{ color: 'var(--facim-gray-500)', fontSize: '13px' }}>Nenhum documento carregado.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {empresa.documentos.map(doc => (
                  <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--facim-gray-200)', borderRadius: '6px', fontSize: '13px', color: 'var(--facim-dark)', textDecoration: 'none' }}>
                    <i className="ti ti-file" style={{ color: 'var(--facim-blue)' }}></i>
                    {doc.tipo}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
