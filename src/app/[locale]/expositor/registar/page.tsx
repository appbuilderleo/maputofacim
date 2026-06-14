'use client';

import { useState, FormEvent } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DISTRITOS, SECTORES_ACTIVIDADE } from '@/lib/constants';
import styles from '../login/page.module.css';

export default function RegistarPage() {
  const router = useRouter();
  const t = useTranslations('Registar');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1 — Account
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Step 2 — Company
    nomeEmpresa: '',
    nuit: '',
    sector: '',
    distrito: '',
    telefoneEmpresa: '',
    emailEmpresa: '',
    descricao: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      setError(t('errMissing'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('errMismatch'));
      return;
    }
    if (formData.password.length < 8) {
      setError(t('errLength'));
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nomeEmpresa || !formData.nuit || !formData.sector || !formData.distrito) {
      setError(t('errMissing'));
      return;
    }

    setLoading(true);

    try {
      // 1. Register user
      const regRes = await fetch('/api/auth/registar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'EXPOSITOR',
        }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        setError(regData.error || t('errRegister'));
        setLoading(false);
        return;
      }

      // 2. Create company
      const empRes = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nomeEmpresa,
          nuit: formData.nuit,
          sectorActividade: formData.sector,
          distrito: formData.distrito,
          telefone: formData.telefoneEmpresa || formData.phone,
          email: formData.emailEmpresa || formData.email,
          descricao: formData.descricao,
        }),
      });

      if (!empRes.ok) {
        const empData = await empRes.json();
        setError(empData.error || t('errCompany'));
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push('/expositor/dashboard');
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
              {t('brandTitle')} <span>FACIM 2026</span>
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
            {/* Steps */}
            <div className={styles.steps}>
              <div className={`${styles.step} ${step === 1 ? styles.stepActive : step > 1 ? styles.stepDone : ''}`}>
                <div className={styles.stepDot}>{step > 1 ? '✓' : '1'}</div>
                <span className={styles.stepLabel}>{t('step1Label')}</span>
              </div>
              <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}>
                <div className={styles.stepDot}>2</div>
                <span className={styles.stepLabel}>{t('step2Label')}</span>
              </div>
            </div>

            <div className={styles.formHeader}>
              <h2>{step === 1 ? t('step1Title') : t('step2Title')}</h2>
              <p>{step === 1 ? t('step1Sub') : t('step2Sub')}</p>
            </div>

            {error && (
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <i className="ti ti-alert-triangle alert-icon" aria-hidden="true" style={{ color: 'var(--facim-gold)' }}></i>
                <div>
                  <div className="alert-title">{t('alertAttention')}</div>
                  <div className="alert-text">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {step === 1 && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-name">{t('lblName')}</label>
                    <input id="reg-name" className="form-input" type="text" placeholder={t('plhName')}
                      value={formData.name} onChange={(e) => updateField('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">Email *</label>
                    <input id="reg-email" className="form-input" type="email" placeholder="email@exemplo.com"
                      value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-phone">{t('lblPhone')}</label>
                    <input id="reg-phone" className="form-input" type="text" placeholder={t('plhPhone')}
                      value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">{t('lblPassword')}</label>
                    <div className={styles.passwordField}>
                      <input id="reg-password" className="form-input" type={showPassword ? 'text' : 'password'}
                        placeholder={t('plhPassword')} value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)} required />
                      <button type="button" className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}>
                        <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                      </button>
                    </div>
                    <div className="form-hint">{t('hintPassword')}</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-confirm">{t('lblConfirm')}</label>
                    <input id="reg-confirm" className="form-input" type="password" placeholder={t('plhConfirm')}
                      value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '8px' }}>
                    {t('btnContinue')}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-empresa">{t('lblCompanyName')}</label>
                      <input id="reg-empresa" className="form-input" type="text" placeholder={t('plhCompanyName')}
                        value={formData.nomeEmpresa} onChange={(e) => updateField('nomeEmpresa', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-nuit">{t('lblNuit')}</label>
                      <input id="reg-nuit" className="form-input" type="text" placeholder={t('plhNuit')}
                        value={formData.nuit} onChange={(e) => updateField('nuit', e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-sector">{t('lblSector')}</label>
                      <select id="reg-sector" className="form-select"
                        value={formData.sector} onChange={(e) => updateField('sector', e.target.value)} required>
                        <option value="">{t('optionSelect')}</option>
                        {SECTORES_ACTIVIDADE.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-distrito">{t('lblDistrict')}</label>
                      <select id="reg-distrito" className="form-select"
                        value={formData.distrito} onChange={(e) => updateField('distrito', e.target.value)} required>
                        <option value="">{t('optionSelect')}</option>
                        {DISTRITOS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-tel-emp">{t('lblCompPhone')}</label>
                      <input id="reg-tel-emp" className="form-input" type="text" placeholder={t('plhCompPhone')}
                        value={formData.telefoneEmpresa} onChange={(e) => updateField('telefoneEmpresa', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-email-emp">{t('lblCompEmail')}</label>
                      <input id="reg-email-emp" className="form-input" type="email" placeholder={t('plhCompEmail')}
                        value={formData.emailEmpresa} onChange={(e) => updateField('emailEmpresa', e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-desc">{t('lblDesc')}</label>
                    <textarea id="reg-desc" className="form-textarea" rows={3}
                      placeholder={t('plhDesc')}
                      value={formData.descricao} onChange={(e) => updateField('descricao', e.target.value)} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
                      {t('btnBack')}
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 2 }}>
                      {loading ? t('btnRegistering') : (
                        <><i className="ti ti-send" aria-hidden="true"></i> {t('btnRegister')}</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className={styles.formFooter}>
              <p>
                {t('hasAccount')}{' '}
                <Link href="/expositor/login" className={styles.linkOrange}>
                  {t('linkLogin')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
