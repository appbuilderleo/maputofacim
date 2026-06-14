import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function PerfilPatrocinadorPage() {
  const user = await getSessionUser();
  if (!user) redirect('/patrocinador/login');

  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id }
  });

  if (!empresa) {
    return <div>Perfil de empresa não encontrado.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Perfil da Empresa Patrocinadora
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Actualize os dados institucionais e de contacto da sua empresa.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome da Empresa</label>
              <input type="text" className="form-input" defaultValue={empresa.nome} disabled />
              <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', marginTop: '4px' }}>O nome institucional não pode ser alterado após o registo.</span>
            </div>
            <div className="form-group">
              <label className="form-label">NUIT</label>
              <input type="text" className="form-input" defaultValue={empresa.nuit} disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sector de Actividade</label>
              <input type="text" className="form-input" defaultValue={empresa.sectorActividade} />
            </div>
            <div className="form-group">
              <label className="form-label">Distrito Sede</label>
              <input type="text" className="form-input" defaultValue={empresa.distrito} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Telefone de Contacto (Gestor de Patrocínios)</label>
              <input type="text" className="form-input" defaultValue={empresa.telefone} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Corporativo</label>
              <input type="email" className="form-input" defaultValue={empresa.email} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição da Marca (Para Website)</label>
            <textarea className="form-textarea" rows={3} defaultValue={empresa.descricao || ''} placeholder="Esta descrição poderá aparecer na página de patrocinadores..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="button" className="btn btn-primary" style={{ background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)', color: '#7A4A00' }}>
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
