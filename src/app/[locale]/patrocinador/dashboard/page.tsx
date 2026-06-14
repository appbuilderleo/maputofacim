import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import RealTimeRefresher from '@/components/RealTimeRefresher';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Link } from '@/i18n/routing';

export default async function PatrocinadorDashboard() {
  const user = await getSessionUser();
  if (!user) return null;

  const empresa = await prisma.empresa.findUnique({
    where: { userId: user.id },
    include: {
      patrocinio: {
        include: { pacote: true }
      }
    }
  });

  const patrocinio = empresa?.patrocinio;

  async function uploadLogo(formData: FormData) {
    'use server';
    const file = formData.get('logotipo') as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public/uploads/logos');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      const url = `/uploads/logos/${filename}`;
      
      await prisma.empresa.update({
        where: { userId: user!.id },
        data: { logotipo: url }
      });
      
      revalidatePath('/patrocinador/dashboard');
    }
  }

  return (
    <div>
      <RealTimeRefresher intervalMs={60000} />
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Portal do Patrocinador
        </h1>
        <p style={{ color: 'var(--facim-gray-500)' }}>
          Bem-vindo, parceiro <strong>{empresa?.nome || user.name}</strong>. Acompanhe os detalhes do seu pacote de patrocínio.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Status Pacote */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>O Seu Pacote</h3>
            <i className="ti ti-star" style={{ fontSize: '24px', color: 'var(--facim-gold)' }}></i>
          </div>
          
          {patrocinio ? (
            <>
              <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--facim-dark)', marginBottom: '8px' }}>
                {patrocinio.pacote.nome}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--facim-gray-600)' }}>Estado:</span>
                <span className={`badge ${patrocinio.estado === 'CONFIRMADO' ? 'badge-teal' : 'badge-orange'}`}>
                  {patrocinio.estado.replace('_', ' ')}
                </span>
              </div>
              
              {patrocinio.estado === 'INTERESSE' && (
                <div style={{ padding: '16px', background: 'var(--facim-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--facim-orange)', marginTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', color: 'var(--facim-dark)', fontWeight: 600, marginBottom: '4px' }}>Pedido em Análise</h4>
                  <p style={{ fontSize: '13px', color: 'var(--facim-gray-600)', lineHeight: '1.5', margin: 0 }}>
                    A sua intenção foi registada com sucesso. A nossa equipa comercial entrará em contacto brevemente através do e-mail ou telefone para acertar os pormenores do contrato.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div>
              <p style={{ fontSize: '14px', color: 'var(--facim-gray-600)', marginBottom: '16px' }}>
                Ainda não tem nenhum pacote associado à sua marca. Descubra as vantagens e escolha a melhor opção para a sua empresa.
              </p>
              <Link href="/patrocinador/dashboard/pacote" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)', color: '#7A4A00', textDecoration: 'none' }}>
                Escolher Pacote de Patrocínio →
              </Link>
            </div>
          )}
        </div>

        {/* Visibilidade */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--facim-dark)' }}>Estatísticas de Exposição</h3>
            <i className="ti ti-chart-pie" style={{ fontSize: '24px', color: 'var(--facim-blue)' }}></i>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--facim-dark)' }}>
              12.4k
            </div>
            <div style={{ fontSize: '13px', color: 'var(--facim-gray-500)', lineHeight: '1.2' }}>
              Visualizações da Marca<br/>no site oficial
            </div>
          </div>
        </div>
      </div>

      {patrocinio?.estado === 'CONFIRMADO' && (
        <div style={{ background: 'var(--badge-gold-bg)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(212, 168, 67, 0.3)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <i className="ti ti-info-circle" style={{ fontSize: '24px', color: 'var(--facim-gold)', marginTop: '2px' }}></i>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: '#7A4A00', marginBottom: '8px' }}>
              Submissão de Materiais Gráficos
            </h4>
            <p style={{ fontSize: '14px', color: '#965A00', lineHeight: '1.6', marginBottom: '16px' }}>
              Para garantir que a sua marca é incluída em todo o material de divulgação (telas, catálogos e mupis), precisamos do seu logotipo em formato vectorial (.ai, .eps, ou .pdf) até dia 30 de Julho.
            </p>
            
            {empresa?.logotipo ? (
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.8)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(212, 168, 67, 0.5)' }}>
                <i className="ti ti-circle-check-filled" style={{ color: 'var(--facim-teal)', fontSize: '24px' }}></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: 'var(--facim-dark)', fontWeight: 700 }}>Logotipo Recebido</div>
                  <div style={{ fontSize: '12px', color: 'var(--facim-gray-600)' }}>A nossa equipa já tem acesso ao seu ficheiro.</div>
                </div>
                <a href={empresa.logotipo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ color: 'var(--facim-gold)' }}>
                  <i className="ti ti-external-link"></i> Ver Ficheiro
                </a>
              </div>
            ) : (
              <form action={uploadLogo} style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '500px' }}>
                <input type="file" name="logotipo" accept=".ai,.eps,.pdf,.png,.jpg,.jpeg" required className="form-input" style={{ flex: 1, padding: '8px', background: 'white', borderColor: 'rgba(212, 168, 67, 0.5)' }} />
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)', color: '#7A4A00', whiteSpace: 'nowrap' }}>
                  <i className="ti ti-upload" aria-hidden="true"></i> Enviar Logotipo
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
