import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function AdminPerfilPage({ searchParams }: { searchParams?: { success?: string, error?: string } }) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  async function atualizarPerfil(formData: FormData) {
    'use server';
    const nome = formData.get('nome') as string;
    const password = formData.get('password') as string;
    
    try {
      let dataToUpdate: any = { name: nome };
      if (password && password.length >= 6) {
        dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
      }
      
      await prisma.user.update({
        where: { id: user!.id },
        data: dataToUpdate
      });
      
      redirect('/admin/perfil?success=1');
    } catch (e) {
      redirect('/admin/perfil?error=1');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--facim-dark)', marginBottom: '8px' }}>
          O Meu Perfil
        </h1>
        <p style={{ color: 'var(--facim-gray-500)', fontSize: '14px' }}>
          Faça a gestão da sua conta de Administrador.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--facim-gray-200)', maxWidth: '800px' }}>
        
        {searchParams?.success && (
          <div style={{ padding: '16px', background: 'rgba(32, 178, 170, 0.1)', color: 'var(--facim-teal)', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <i className="ti ti-check" style={{ fontSize: '20px' }}></i>
            Perfil e credenciais actualizados com sucesso!
          </div>
        )}

        {searchParams?.error && (
          <div style={{ padding: '16px', background: 'rgba(232, 74, 0, 0.1)', color: 'var(--facim-danger)', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '20px' }}></i>
            Ocorreu um erro ao actualizar o perfil.
          </div>
        )}

        <form action={atualizarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input type="text" name="nome" className="form-input" defaultValue={user.name} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email de Acesso</label>
            <input type="email" className="form-input" defaultValue={user.email} disabled />
            <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', marginTop: '4px' }}>O email não pode ser alterado por questões de segurança.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Nível de Acesso</label>
            <input type="text" className="form-input" defaultValue={user.role} disabled style={{ background: 'var(--facim-off-white)' }} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--facim-gray-200)', margin: '8px 0' }} />

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--facim-dark)', marginBottom: '16px' }}>Segurança</h3>
            <div className="form-group">
              <label className="form-label">Nova Senha (opcional)</label>
              <input type="password" name="password" className="form-input" placeholder="Preencha apenas se quiser alterar a senha" minLength={6} />
              <span style={{ fontSize: '12px', color: 'var(--facim-gray-400)', marginTop: '4px' }}>Mínimo 6 caracteres.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" style={{ background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)', color: '#7A4A00' }}>
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
