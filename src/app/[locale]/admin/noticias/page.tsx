import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { revalidatePath } from 'next/cache';

export default async function AdminNoticiasPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  const noticias = await prisma.noticia.findMany({
    include: { autor: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  async function togglePublicacao(id: string, publicado: boolean) {
    'use server';
    await prisma.noticia.update({
      where: { id },
      data: { publicado: !publicado, publishedAt: !publicado ? new Date() : null }
    });
    revalidatePath('/admin/noticias');
    revalidatePath('/noticias'); // Refresh public news page
  }

  async function apagarNoticia(id: string) {
    'use server';
    await prisma.noticia.delete({ where: { id } });
    revalidatePath('/admin/noticias');
    revalidatePath('/noticias');
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
            Notícias & Comunicação
          </h1>
          <p style={{ color: 'var(--facim-gray-500)' }}>
            Faça a gestão dos artigos e actualizações que aparecem no site público.
          </p>
        </div>
        <div>
          <Link href="/admin/noticias/novo" className="btn btn-primary">
            <i className="ti ti-plus" aria-hidden="true"></i> Nova Notícia
          </Link>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--facim-gray-200)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--facim-gray-200)', background: '#FAFAFA', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <input type="text" placeholder="Pesquisar título..." className="form-input" style={{ maxWidth: '300px' }} />
          <select className="form-select" style={{ maxWidth: '200px' }}>
            <option value="">Todos os Estados</option>
            <option value="PUBLICADO">Publicados</option>
            <option value="RASCUNHO">Rascunhos</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--facim-gray-200)', textAlign: 'left', color: 'var(--facim-gray-500)', background: 'white' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Título e Resumo</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Autor</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600 }}>Acções</th>
              </tr>
            </thead>
            <tbody>
              {noticias.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--facim-gray-400)' }}>
                    Nenhuma notícia registada.
                  </td>
                </tr>
              ) : (
                noticias.map(noticia => (
                  <tr key={noticia.id} style={{ borderBottom: '1px solid var(--facim-gray-100)' }}>
                    <td data-label="Título e Resumo" style={{ padding: '16px 24px', maxWidth: '400px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--facim-dark)', marginBottom: '4px' }}>
                        {noticia.destaque && <i className="ti ti-star-filled" style={{ color: 'var(--facim-gold)', marginRight: '8px' }}></i>}
                        {noticia.titulo}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--facim-gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {noticia.resumo}
                      </div>
                    </td>
                    <td data-label="Autor" style={{ padding: '16px 24px', color: 'var(--facim-gray-600)' }}>{noticia.autor.name}</td>
                    <td data-label="Estado" style={{ padding: '16px 24px' }}>
                      <span className={`badge ${noticia.publicado ? 'badge-teal' : 'badge-gray'}`}>
                        {noticia.publicado ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td data-label="Acções" style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <form action={togglePublicacao.bind(null, noticia.id, noticia.publicado)}>
                          <button type="submit" className="btn btn-ghost btn-sm" style={{ padding: '8px', color: noticia.publicado ? 'var(--facim-orange)' : 'var(--facim-teal)' }} title={noticia.publicado ? 'Ocultar' : 'Publicar'}>
                            <i className={`ti ${noticia.publicado ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: '18px' }}></i>
                          </button>
                        </form>
                        <form action={apagarNoticia.bind(null, noticia.id)}>
                          <button type="submit" className="btn btn-ghost btn-sm" style={{ padding: '8px', color: 'var(--facim-danger)' }} title="Apagar">
                            <i className="ti ti-trash" style={{ fontSize: '18px' }}></i>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
