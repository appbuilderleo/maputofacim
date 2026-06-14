import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function CandidaturaPage() {
  const user = await getSessionUser();
  if (!user) redirect('/expositor/login');

  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id },
    include: { candidatura: true }
  });

  if (!empresa) {
    return <div>Empresa não encontrada.</div>;
  }

  const hasCandidatura = !!empresa.candidatura;
  const candidatura = empresa.candidatura;

  async function iniciarCandidatura() {
    'use server';
    
    // Create an initial draft
    await prisma.candidatura.create({
      data: {
        empresaId: empresa!.id,
        estado: 'RASCUNHO',
      }
    });
    
    revalidatePath('/expositor/dashboard/candidatura');
    revalidatePath('/expositor/dashboard');
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Gestão de Candidatura
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Preencha ou actualize os detalhes da sua participação na FACIM 2026.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        {hasCandidatura && candidatura ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--facim-gray-200)' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Estado Actual</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800 }}>
                    {candidatura.estado.replace('_', ' ')}
                  </span>
                  <span className={`badge ${candidatura.estado === 'APROVADA' ? 'badge-teal' : 'badge-orange'}`}>
                    {candidatura.estado === 'APROVADA' ? 'Confirmado' : (candidatura.estado === 'RASCUNHO' ? 'Por Submeter' : 'A aguardar análise')}
                  </span>
                </div>
              </div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo de Stand Pretendido</label>
                  <select className="form-select" defaultValue={candidatura.tipoStand || ''} disabled={candidatura.estado === 'APROVADA'}>
                    <option value="">Seleccione o tipo de espaço...</option>
                    <option value="interior_livre">Interior - Espaço Livre (sem montagem)</option>
                    <option value="interior_equipado">Interior - Stand Equipado (9m²)</option>
                    <option value="exterior">Exterior - Espaço Livre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Área Desejada (m²)</label>
                  <input className="form-input" type="number" min="9" step="1" defaultValue={candidatura.areaDesejada || ''} disabled={candidatura.estado === 'APROVADA'} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Produtos/Serviços a Expor</label>
                <textarea className="form-textarea" rows={3} defaultValue={candidatura.produtosExibir || ''} disabled={candidatura.estado === 'APROVADA'} placeholder="Descreva os produtos ou serviços que pretende promover no seu stand..." />
              </div>

              <div className="form-group">
                <label className="form-label">Necessidades Específicas</label>
                <textarea className="form-textarea" rows={2} defaultValue={candidatura.necessidades || ''} disabled={candidatura.estado === 'APROVADA'} placeholder="Ex: Ligação trifásica, água, armazém..." />
              </div>

              {candidatura.estado !== 'APROVADA' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="btn btn-primary">
                    Guardar e Submeter Candidatura
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--badge-orange-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-orange)', fontSize: '32px', margin: '0 auto 24px' }}>
              <i className="ti ti-file-description"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--facim-dark)', marginBottom: '8px' }}>
              Ainda não submeteu a sua candidatura
            </h3>
            <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 24px' }}>
              Para garantir o seu espaço na FACIM 2026, é necessário preencher o formulário de candidatura detalhando as suas necessidades de exposição.
            </p>
            <form action={iniciarCandidatura}>
              <button type="submit" className="btn btn-primary">
                <i className="ti ti-plus"></i> Iniciar Candidatura
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
