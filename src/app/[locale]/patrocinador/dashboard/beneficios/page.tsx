import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default async function BeneficiosPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'PATROCINADOR') redirect('/patrocinador/login');

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Matriz de Benefícios
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Consulte detalhadamente todas as vantagens associadas a cada escalão de patrocínio.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--facim-gray-200)' }}>
        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: 'var(--facim-dark)', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '20px 24px', fontWeight: 600, width: '40%' }}>Benefício / Categoria</th>
              <th style={{ padding: '20px 24px', fontWeight: 600, textAlign: 'center', width: '20%' }}>Silver (Apoio)</th>
              <th style={{ padding: '20px 24px', fontWeight: 600, textAlign: 'center', width: '20%', background: 'var(--facim-gold)' }}>Gold (Oficial)</th>
              <th style={{ padding: '20px 24px', fontWeight: 600, textAlign: 'center', width: '20%' }}>Platinum (Principal)</th>
            </tr>
          </thead>
          <tbody>
            
            {/* Secção Marca */}
            <tr style={{ background: 'var(--facim-off-white)' }}>
              <td colSpan={4} style={{ padding: '12px 24px', fontWeight: 700, color: 'var(--facim-dark)', borderBottom: '1px solid var(--facim-gray-200)' }}>
                Visibilidade da Marca
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--facim-gray-200)' }}>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Logo no Website Oficial</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i> (Pequeno)</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i> (Médio)</td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i> (Grande + Link)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--facim-gray-200)' }}>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Logo nos Outdoors/Cartazes</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}>-</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i></td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--facim-gray-200)' }}>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Logo no Palco Principal (Cerimónias)</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}>-</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>-</td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i> (Exclusivo)</td>
            </tr>

            {/* Secção Área */}
            <tr style={{ background: 'var(--facim-off-white)' }}>
              <td colSpan={4} style={{ padding: '12px 24px', fontWeight: 700, color: 'var(--facim-dark)', borderBottom: '1px solid var(--facim-gray-200)' }}>
                Área de Exposição
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--facim-gray-200)' }}>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Stand Livre no Pavilhão VIP</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}>Até 25m²</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>Até 50m²</td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}>Até 100m²</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--facim-gray-200)' }}>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Estacionamento Exclusivo (Viaturas)</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}>1</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>3</td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}>5</td>
            </tr>

            {/* Secção Media */}
            <tr style={{ background: 'var(--facim-off-white)' }}>
              <td colSpan={4} style={{ padding: '12px 24px', fontWeight: 700, color: 'var(--facim-dark)', borderBottom: '1px solid var(--facim-gray-200)' }}>
                Assessoria e Media
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--facim-gray-200)' }}>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Menções nos Spots de Rádio/TV</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}>-</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>Apenas Rádio</td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}>TV & Rádio</td>
            </tr>
            <tr>
              <td data-label="Benefício" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)', fontWeight: 600 }}>Entrevista Exclusiva</td>
              <td data-label="Silver (Apoio)" style={{ padding: '16px 24px', textAlign: 'center' }}>-</td>
              <td data-label="Gold (Oficial)" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>-</td>
              <td data-label="Platinum (Principal)" style={{ padding: '16px 24px', textAlign: 'center' }}><i className="ti ti-check" style={{ color: 'var(--facim-teal)' }}></i> (Canal Parceiro)</td>
            </tr>

          </tbody>
        </table>
        
        <div style={{ padding: '24px', background: 'var(--facim-off-white)', borderTop: '1px solid var(--facim-gray-200)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--facim-gray-600)', marginBottom: '16px' }}>Pronto para potenciar a sua marca na maior feira de negócios de Moçambique?</p>
          <Link href="/patrocinador/dashboard/pacote" className="btn btn-primary">Escolher o meu Pacote</Link>
        </div>
      </div>
    </div>
  );
}
