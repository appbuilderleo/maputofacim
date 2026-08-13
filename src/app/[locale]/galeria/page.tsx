import prisma from '@/lib/prisma';
import GaleriaClient from '@/components/GaleriaClient';

export default async function GaleriaPage() {
  const items = await prisma.itemGaleria.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'var(--facim-dark)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Galeria <span style={{ color: 'var(--facim-gold)' }}>FACIM</span>
          </h1>
          <p style={{ color: 'var(--facim-gray-600)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Reviva os melhores momentos das edições passadas e acompanhe as novidades multimédia do maior evento de negócios de Moçambique.
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', background: 'var(--facim-off-white)', borderRadius: 'var(--radius-lg)' }}>
            <i className="ti ti-camera" style={{ fontSize: '48px', color: 'var(--facim-gray-400)', marginBottom: '16px' }}></i>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--facim-dark)', marginBottom: '8px' }}>Galeria em actualização</h3>
            <p style={{ color: 'var(--facim-gray-500)' }}>Estamos a preparar o melhor conteúdo para si. Volte em breve!</p>
          </div>
        ) : (
          <GaleriaClient items={items} />
        )}
      </div>
    </div>
  );
}
