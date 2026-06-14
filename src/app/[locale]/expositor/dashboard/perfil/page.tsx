import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect('/expositor/login');

  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id }
  });

  if (!empresa) {
    return <div>Empresa não encontrada.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Perfil da Empresa
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Actualize os dados comerciais e de contacto da sua empresa.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome da Empresa</label>
              <input type="text" className="form-input" defaultValue={empresa.nome} disabled />
              <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', marginTop: '4px' }}>O nome comercial não pode ser alterado após o registo.</span>
            </div>
            <div className="form-group">
              <label className="form-label">NUIT</label>
              <input type="text" className="form-input" defaultValue={empresa.nuit} disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sector de Actividade</label>
              <select className="form-select" defaultValue={empresa.sectorActividade}>
                <option value="Agricultura e Agro-processamento">Agricultura e Agro-processamento</option>
                <option value="Indústria Transformadora">Indústria Transformadora</option>
                <option value="Comércio e Serviços">Comércio e Serviços</option>
                <option value="Tecnologia e Inovação">Tecnologia e Inovação</option>
                <option value="Turismo">Turismo</option>
                <option value="Outro">Outro Sector</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Distrito</label>
              <select className="form-select" defaultValue={empresa.distrito}>
                <option value="Boane">Boane</option>
                <option value="Magude">Magude</option>
                <option value="Manhiça">Manhiça</option>
                <option value="Marracuene">Marracuene</option>
                <option value="Matola">Matola</option>
                <option value="Matutuíne">Matutuíne</option>
                <option value="Moamba">Moamba</option>
                <option value="Namaacha">Namaacha</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Telefone de Contacto</label>
              <input type="text" className="form-input" defaultValue={empresa.telefone} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Corporativo</label>
              <input type="email" className="form-input" defaultValue={empresa.email} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Endereço Físico</label>
            <input type="text" className="form-input" defaultValue={empresa.endereco || ''} placeholder="Ex: Av. das Indústrias, Parcela 123, Machava" />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição Breve da Empresa</label>
            <textarea className="form-textarea" rows={3} defaultValue={empresa.descricao || ''} placeholder="Descreva brevemente a sua empresa e principais produtos..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="button" className="btn btn-primary">
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
