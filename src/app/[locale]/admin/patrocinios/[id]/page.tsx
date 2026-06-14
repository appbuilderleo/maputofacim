import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { revalidatePath } from 'next/cache';

export default async function AdminPatrocinioDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  const { id } = await params;

  const patrocinio = await prisma.patrocinio.findUnique({
    where: { id: id },
    include: {
      empresa: { include: { user: true } },
      pacote: true
    }
  });

  if (!patrocinio) return <div>Patrocínio não encontrado</div>;

  async function actualizarEstado(formData: FormData) {
    'use server';
    const novoEstado = formData.get('estado') as any;
    
    await prisma.patrocinio.update({
      where: { id: id },
      data: { estado: novoEstado }
    });

    revalidatePath(`/admin/patrocinios/${id}`);
    revalidatePath('/admin/patrocinios');
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/patrocinios" style={{ color: 'var(--facim-gray-500)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-arrow-left"></i> Voltar à Lista de Patrocínios
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            Detalhes do Patrocínio
          </h1>
          <p style={{ color: 'var(--facim-gray-500)' }}>
            Empresa interessada no pacote <strong style={{ color: 'var(--facim-gold)' }}>{patrocinio.pacote.nome}</strong>.
          </p>
        </div>
        <div>
          <span className={`badge ${patrocinio.estado === 'CONFIRMADO' ? 'badge-teal' : patrocinio.estado === 'REJEITADO' ? 'badge-danger' : 'badge-orange'}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
            {patrocinio.estado.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Lado Esquerdo - Detalhes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '24px', borderBottom: '1px solid var(--facim-gray-200)', paddingBottom: '16px' }}>
              Dados da Empresa Parceira
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--facim-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Nome da Empresa</span>
                <div style={{ fontSize: '16px', color: 'var(--facim-dark)', fontWeight: 500, marginTop: '4px' }}>{patrocinio.empresa.nome}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--facim-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>NUIT</span>
                <div style={{ fontSize: '16px', color: 'var(--facim-dark)', fontWeight: 500, marginTop: '4px' }}>{patrocinio.empresa.nuit}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--facim-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Sector de Actividade</span>
                <div style={{ fontSize: '16px', color: 'var(--facim-dark)', fontWeight: 500, marginTop: '4px' }}>{patrocinio.empresa.sectorActividade}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--facim-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Distrito</span>
                <div style={{ fontSize: '16px', color: 'var(--facim-dark)', fontWeight: 500, marginTop: '4px' }}>{patrocinio.empresa.distrito}</div>
              </div>
            </div>
            
            <h4 style={{ fontSize: '14px', color: 'var(--facim-gray-600)', marginTop: '32px', marginBottom: '16px', fontWeight: 600 }}>Contactos do Responsável</h4>
            <div style={{ background: 'var(--facim-off-white)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ti ti-user" style={{ color: 'var(--facim-gray-400)' }}></i> {patrocinio.empresa.user.name}</div>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ti ti-mail" style={{ color: 'var(--facim-gray-400)' }}></i> {patrocinio.empresa.email || patrocinio.empresa.user.email}</div>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ti ti-phone" style={{ color: 'var(--facim-gray-400)' }}></i> {patrocinio.empresa.telefone || 'Não fornecido'}</div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Acções e Pacote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Caixa de Acção */}
          <div style={{ background: 'var(--facim-dark)', borderRadius: 'var(--radius-lg)', padding: '24px', color: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-gold)', marginBottom: '16px' }}>Decisão Comercial</h3>
            <p style={{ fontSize: '13px', color: 'var(--facim-gray-300)', marginBottom: '24px', lineHeight: '1.5' }}>
              Mude o estado deste pedido. Se o contrato estiver assinado e os pagamentos regularizados, altere para Confirmado.
            </p>
            
            <form action={actualizarEstado} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select name="estado" className="form-select" defaultValue={patrocinio.estado} style={{ width: '100%', color: '#333' }}>
                <option value="INTERESSE">Interesse Registado</option>
                <option value="APROVADO">Em Negociação</option>
                <option value="CONFIRMADO">Confirmado (Activo)</option>
                <option value="REJEITADO">Rejeitado / Cancelado</option>
              </select>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)', color: '#7A4A00' }}>
                <i className="ti ti-device-floppy"></i> Guardar Estado
              </button>
            </form>
          </div>

          {/* Resumo do Pacote */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)', marginBottom: '16px' }}>
              Detalhes do Pacote
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--facim-gray-500)' }}>Nome:</span>
              <strong style={{ color: 'var(--facim-dark)' }}>{patrocinio.pacote.nome}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--facim-gray-500)' }}>Custo Base:</span>
              <strong style={{ color: 'var(--facim-dark)' }}>{patrocinio.pacote.preco ? Number(patrocinio.pacote.preco).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) : 'Sob Consulta'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--facim-gray-500)' }}>Solicitado a:</span>
              <strong style={{ color: 'var(--facim-dark)' }}>{patrocinio.dataSolicitacao.toLocaleDateString('pt-PT')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
