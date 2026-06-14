'use client';

import { useState, FormEvent } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('Login');
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
        setError(data.error || t('errLogin'));
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (data.user.role === 'PATROCINADOR') {
        router.push('/patrocinador/dashboard');
      } else {
        router.push('/expositor/dashboard');
      }
    } catch {
      setError(t('errConnection'));
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* Left Side — Branding */}
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <span className={styles.brandEyebrow}>{t('brandEyebrow')}</span>
            <h1 className={styles.brandTitle}>
              {t('brandTitle')} <span>FACIM</span>
            </h1>
            <p className={styles.brandDesc}>
              {t('brandDesc')}
            </p>
            <div className={styles.brandDeco}></div>
            <div className={styles.brandDeco2}></div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2>{t('formTitle')}</h2>
              <p>{t('formSub')}</p>
            </div>

            {error && (
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <i className="ti ti-alert-triangle alert-icon" aria-hidden="true" style={{ color: 'var(--facim-gold)' }}></i>
                <div>
                  <div className="alert-title">{t('alertError')}</div>
                  <div className="alert-text">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">{t('lblEmail')}</label>
                <input
                  id="login-email"
                  className="form-input"
                  type="email"
                  placeholder={t('plhEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">{t('lblPassword')}</label>
                <div className={styles.passwordField}>
                  <input
                    id="login-password"
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('plhPassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  >
                    <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                {loading ? t('btnLoggingIn') : t('btnLogin')}
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                {t('noAccount')}{' '}
                <Link href="/expositor/registar" className={styles.linkOrange}>
                  {t('linkRegister')}
                </Link>
              </p>
              <p style={{ marginTop: '8px' }}>
                <Link href="/patrocinador/login" className={styles.linkMuted}>
                  {t('linkSponsor')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
