'use client';

import { useState, FormEvent } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import styles from '../../expositor/login/page.module.css';

export default function PatrocinadorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao iniciar sessão');
        setLoading(false);
        return;
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/patrocinador/dashboard');
      }
    } catch {
      setError('Erro de ligação. Verifique a sua internet.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* Left Side — Branding */}
        <div className={styles.brandSide} style={{ background: '#0F2440' }}>
          <div className={styles.brandContent}>
            <span className={styles.brandEyebrow} style={{ color: 'var(--facim-gold)' }}>Portal do Patrocinador</span>
            <h1 className={styles.brandTitle}>
              Parceiros da <span>FACIM</span>
            </h1>
            <p className={styles.brandDesc}>
              Aceda à sua área reservada para gerir o seu pacote de patrocínio, 
              carregar os materiais da sua marca e acompanhar os benefícios exclusivos.
            </p>
            <div className={styles.brandDeco} style={{ borderColor: 'rgba(212, 168, 67, 0.12)' }}></div>
            <div className={styles.brandDeco2} style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}></div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2>Acesso a Patrocinadores</h2>
              <p>Insira as suas credenciais para aceder à plataforma</p>
            </div>

            {error && (
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <i className="ti ti-alert-triangle alert-icon" aria-hidden="true" style={{ color: 'var(--facim-gold)' }}></i>
                <div>
                  <div className="alert-title">Erro</div>
                  <div className="alert-text">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  className="form-input"
                  type="email"
                  placeholder="email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Palavra-passe</label>
                <div className={styles.passwordField}>
                  <input
                    id="login-password"
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '8px', background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)', color: '#7A4A00' }}
              >
                {loading ? 'Entrando...' : 'Entrar na Área Reservada'}
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                Ainda não é patrocinador?{' '}
                <Link href="/patrocinador/registar" className={styles.linkOrange} style={{ color: 'var(--facim-gold)' }}>
                  Faça o seu registo aqui
                </Link>
              </p>
              <p style={{ marginTop: '8px' }}>
                <Link href="/expositor/login" className={styles.linkMuted}>
                  Acesso para expositores →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
