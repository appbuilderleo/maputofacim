import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DocumentosPage() {
  const user = await getSessionUser();
  if (!user) redirect('/expositor/login');

  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id },
    include: { documentos: true }
  });

  if (!empresa) return <div>Empresa não encontrada.</div>;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Gestão de Documentos
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Faça o upload dos documentos obrigatórios para validar a sua inscrição.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Documento 1: Alvará */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--facim-gray-200)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--facim-off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-gray-400)' }}>
                <i className="ti ti-file-certificate" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--facim-dark)', marginBottom: '2px' }}>Alvará Comercial</h4>
                <p style={{ fontSize: '13px', color: 'var(--facim-gray-500)' }}>Obrigatório. Formatos: PDF, JPG, PNG (Max 5MB)</p>
              </div>
            </div>
            <div>
              <button className="btn btn-secondary btn-sm">
                <i className="ti ti-upload"></i> Carregar
              </button>
            </div>
          </div>

          {/* Documento 2: Certidão de Quitação */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--facim-gray-200)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--facim-off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-gray-400)' }}>
                <i className="ti ti-receipt-tax" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--facim-dark)', marginBottom: '2px' }}>Certidão de Quitação das Finanças</h4>
                <p style={{ fontSize: '13px', color: 'var(--facim-gray-500)' }}>Obrigatório. Documento válido emitido pela AT.</p>
              </div>
            </div>
            <div>
              <button className="btn btn-secondary btn-sm">
                <i className="ti ti-upload"></i> Carregar
              </button>
            </div>
          </div>

          {/* Documento 3: Comprovativo de Pagamento */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--facim-gray-200)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--facim-off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--facim-gray-400)' }}>
                <i className="ti ti-cash-banknote" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--facim-dark)', marginBottom: '2px' }}>Comprovativo de Pagamento</h4>
                <p style={{ fontSize: '13px', color: 'var(--facim-gray-500)' }}>Obrigatório após a aprovação da candidatura.</p>
              </div>
            </div>
            <div>
              <button className="btn btn-secondary btn-sm" disabled>
                <i className="ti ti-lock"></i> Bloqueado
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
