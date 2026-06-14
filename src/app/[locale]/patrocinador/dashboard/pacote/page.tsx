import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function PatrocinadorPacotePage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'PATROCINADOR') redirect('/patrocinador/login');

  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id },
    include: { patrocinio: { include: { pacote: true } } }
  });

  if (!empresa) return <div>Empresa não encontrada. Complete o registo.</div>;

  // Garantir que existem pacotes na BD para o utilizador escolher
  let pacotes = await prisma.pacotePatrocinio.findMany({ orderBy: { preco: 'desc' } });
  
  if (pacotes.length === 0) {
    // Auto-seed basic packages if none exist
    await prisma.pacotePatrocinio.createMany({
      data: [
        { nome: 'Platinum', nivel: 'Principal', preco: 5000000, beneficios: ['Logo no Palco Principal', 'Stand de 100m2 livre', 'Menção em TV'] },
        { nome: 'Gold', nivel: 'Oficial', preco: 2500000, beneficios: ['Logo em Outdoors', 'Stand de 50m2', 'Menção na Rádio'] },
        { nome: 'Silver', nivel: 'Apoio', preco: 1000000, beneficios: ['Logo no Website', 'Stand de 25m2'] }
      ]
    });
    pacotes = await prisma.pacotePatrocinio.findMany({ orderBy: { preco: 'desc' } });
  }

  const patrocinio = empresa.patrocinio;

  async function solicitarPacote(formData: FormData) {
    'use server';
    const pacoteId = formData.get('pacoteId') as string;
    
    await prisma.patrocinio.create({
      data: {
        empresaId: empresa!.id,
        pacoteId: pacoteId,
        estado: 'INTERESSE'
      }
    });

    revalidatePath('/patrocinador/dashboard/pacote');
    revalidatePath('/patrocinador/dashboard');
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Gestão de Pacote
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Consulte o seu nível de patrocínio actual ou seleccione um pacote para se tornar parceiro oficial da FACIM 2026.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        
        {patrocinio ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--facim-gray-200)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--facim-off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-star-filled" style={{ fontSize: '32px', color: 'var(--facim-gold)' }}></i>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Pacote Associado</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--facim-dark)', margin: '4px 0' }}>
                  {patrocinio.pacote.nome}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--facim-gray-600)' }}>Estado do Contrato:</span>
                  <span className={`badge ${patrocinio.estado === 'CONFIRMADO' ? 'badge-teal' : patrocinio.estado === 'REJEITADO' ? 'badge-danger' : 'badge-orange'}`}>
                    {patrocinio.estado.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '16px' }}>Benefícios Adquiridos</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(patrocinio.pacote.beneficios as string[]).map((ben, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--facim-gray-600)' }}>
                  <i className="ti ti-check" style={{ color: 'var(--facim-teal)', fontSize: '18px' }}></i> {ben}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '24px', textAlign: 'center' }}>
              Escolha a dimensão da sua Marca na FACIM
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {pacotes.map((pct) => (
                <div key={pct.id} style={{ border: '2px solid var(--facim-gray-200)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'border-color 0.3s' }} className="hover-gold-border">
                  {pct.nome === 'Gold' && (
                    <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--facim-gold)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>Mais Popular</span>
                  )}
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--facim-dark)', textAlign: 'center', marginBottom: '8px' }}>{pct.nome}</h4>
                  <div style={{ fontSize: '13px', color: 'var(--facim-gray-500)', textAlign: 'center', marginBottom: '24px' }}>Nível: {pct.nivel}</div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {(pct.beneficios as string[]).map((b, i) => (
                      <li key={i} style={{ fontSize: '14px', color: 'var(--facim-gray-600)', display: 'flex', gap: '8px' }}>
                        <i className="ti ti-check" style={{ color: 'var(--facim-gold)', marginTop: '2px' }}></i> {b}
                      </li>
                    ))}
                  </ul>

                  <form action={solicitarPacote}>
                    <input type="hidden" name="pacoteId" value={pct.id} />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: pct.nome === 'Gold' ? 'var(--facim-gold)' : 'var(--facim-dark)', borderColor: pct.nome === 'Gold' ? 'var(--facim-gold)' : 'var(--facim-dark)' }}>
                      Solicitar {pct.nome}
                    </button>
                  </form>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--facim-gray-400)', marginTop: '32px' }}>
              Ao solicitar, a nossa equipa comercial entrará em contacto consigo para formalizar o contrato de patrocínio.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
