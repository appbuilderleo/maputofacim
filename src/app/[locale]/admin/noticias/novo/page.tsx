import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import fs from 'fs';
import path from 'path';

export default async function NovaNoticiaPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  async function publicarNoticia(formData: FormData) {
    'use server';
    const titulo = formData.get('titulo') as string;
    const resumo = formData.get('resumo') as string;
    const conteudo = formData.get('conteudo') as string;
    const categoria = formData.get('categoria') as string;
    const videoLink = formData.get('videoLink') as string;
    const destaque = formData.get('destaque') === 'on';
    
    // Processamento do ficheiro de imagem
    const imagemFile = formData.get('imagem') as File;
    let imagemUrl = null;
    
    if (imagemFile && imagemFile.size > 0) {
      const bytes = await imagemFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public/uploads/noticias');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${imagemFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      imagemUrl = `/uploads/noticias/${filename}`;
    }

    // Simple slug generator
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await prisma.noticia.create({
      data: {
        titulo,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        resumo,
        conteudo,
        imagem: imagemUrl,
        videoLink: videoLink || null,
        categoria,
        destaque,
        publicado: true,
        publishedAt: new Date(),
        autorId: user!.id
      }
    });

    redirect('/admin/noticias');
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/noticias" style={{ color: 'var(--facim-gray-500)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-arrow-left"></i> Voltar às Notícias
        </Link>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          Escrever Nova Notícia
        </h1>
        <p style={{ color: 'var(--facim-gray-500)' }}>
          Preencha os campos abaixo para publicar um novo artigo no portal.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)' }}>
        <form action={publicarNoticia} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-group">
            <label className="form-label">Título da Notícia</label>
            <input name="titulo" type="text" className="form-input" placeholder="Ex: Abertura oficial da FACIM 2026..." required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Imagem de Capa (Upload)</label>
              <input name="imagem" type="file" accept="image/png, image/jpeg, image/webp" className="form-input" style={{ padding: '8px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Link do Vídeo (Youtube/Vimeo)</label>
              <input name="videoLink" type="url" className="form-input" placeholder="Ex: https://youtube.com/watch?v=..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select name="categoria" className="form-select" required>
                <option value="institucional">Institucional</option>
                <option value="imprensa">Comunicado de Imprensa</option>
                <option value="expositores">Para Expositores</option>
                <option value="destaque">Destaques</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--facim-dark)', fontWeight: 500 }}>
                <input name="destaque" type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--facim-gold)' }} />
                Marcar como Destaque (Aparece na Homepage)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resumo (Máx 200 caracteres)</label>
            <textarea name="resumo" className="form-textarea" rows={2} placeholder="Um resumo curto que aparece nos cartões e nas redes sociais..." required maxLength={200}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Conteúdo Completo</label>
            <textarea name="conteudo" className="form-textarea" rows={12} placeholder="Escreva o conteúdo completo da notícia aqui..." required></textarea>
            <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', marginTop: '4px', display: 'block' }}>Pode utilizar texto normal. Em actualizações futuras, podemos adicionar um editor rico (WYSIWYG).</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--facim-gray-200)' }}>
            <Link href="/admin/noticias" className="btn btn-white">Cancelar</Link>
            <button type="submit" className="btn btn-primary">Publicar Notícia</button>
          </div>
        </form>
      </div>
    </div>
  );
}
