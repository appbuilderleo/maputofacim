import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export default async function AdminGaleriaPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  const items = await prisma.itemGaleria.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function adicionarImagem(formData: FormData) {
    'use server';
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string;
    const ficheiro = formData.get('ficheiro') as File;
    
    if (ficheiro && ficheiro.size > 0) {
      const bytes = await ficheiro.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public/uploads/galeria');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${ficheiro.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      const url = `/uploads/galeria/${filename}`;

      await prisma.itemGaleria.create({
        data: {
          titulo: titulo || null,
          descricao: descricao || null,
          url,
          tipo: 'IMAGEM'
        }
      });
    }

    revalidatePath('/admin/galeria');
    revalidatePath('/galeria');
  }

  async function adicionarVideo(formData: FormData) {
    'use server';
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string;
    const url = formData.get('url') as string;
    
    if (url) {
      await prisma.itemGaleria.create({
        data: {
          titulo: titulo || null,
          descricao: descricao || null,
          url,
          tipo: 'VIDEO'
        }
      });
    }

    revalidatePath('/admin/galeria');
    revalidatePath('/galeria');
  }

  async function apagarItem(id: string) {
    'use server';
    await prisma.itemGaleria.delete({ where: { id } });
    revalidatePath('/admin/galeria');
    revalidatePath('/galeria');
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Gestão da Galeria
        </h1>
        <p style={{ color: 'var(--facim-gray-500)' }}>
          Faça upload de fotos das edições passadas ou adicione links de vídeos promocionais.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Card Add Image */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-photo" style={{ color: 'var(--facim-gold)' }}></i> Adicionar Fotografia
          </h2>
          <form action={adicionarImagem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="file" name="ficheiro" accept="image/*" className="form-input" style={{ padding: '8px' }} required />
            <input type="text" name="titulo" placeholder="Título (Opcional)" className="form-input" />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Carregar Imagem
            </button>
          </form>
        </div>

        {/* Card Add Video */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--facim-gray-200)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--facim-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-video" style={{ color: 'var(--facim-teal)' }}></i> Adicionar Vídeo
          </h2>
          <form action={adicionarVideo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="url" name="url" placeholder="Link do Youtube (https://youtube.com/watch?...)" className="form-input" required />
            <input type="text" name="titulo" placeholder="Título (Opcional)" className="form-input" />
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Adicionar Vídeo
            </button>
          </form>
        </div>
      </div>

      {/* Grid de Itens */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--facim-dark)', marginBottom: '16px' }}>
        Conteúdo Publicado ({items.length})
      </h2>
      
      {items.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', background: 'white', border: '1px dashed var(--facim-gray-300)', borderRadius: 'var(--radius-lg)', color: 'var(--facim-gray-500)' }}>
          A galeria está vazia. Adicione algumas fotografias ou vídeos acima.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--facim-gray-200)', position: 'relative' }}>
              {item.tipo === 'IMAGEM' ? (
                <div style={{ height: '180px', backgroundImage: `url('${item.url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              ) : (
                <div style={{ height: '180px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <i className="ti ti-brand-youtube" style={{ fontSize: '48px', color: '#ff0000' }}></i>
                </div>
              )}
              
              <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--facim-gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>{item.tipo}</span>
                    <h4 style={{ fontSize: '14px', color: 'var(--facim-dark)', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.titulo || 'Sem título'}
                    </h4>
                  </div>
                  <form action={apagarItem.bind(null, item.id)}>
                    <button type="submit" className="btn btn-ghost btn-sm" style={{ padding: '6px', color: 'var(--facim-danger)' }} title="Apagar">
                      <i className="ti ti-trash"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
