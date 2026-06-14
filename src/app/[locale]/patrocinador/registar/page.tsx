'use client';

import { useState, FormEvent } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { DISTRITOS, SECTORES_ACTIVIDADE } from '@/lib/constants';
import styles from '../../expositor/login/page.module.css'; // Reusing the same auth layout styles

export default function PatrocinadorRegistoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As palavras-passe não coincidem');
      return;
    }
    if (formData.password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nomeEmpresa || !formData.nuit || !formData.sector || !formData.distrito) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      // 1. Regista o Utilizador como PATROCINADOR
      const regRes = await fetch('/api/auth/registar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'PATROCINADOR',
        }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        setError(regData.error || 'Erro ao criar conta');
        setLoading(false);
        return;
      }

      // 2. Cria a entidade Empresa
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
        setError(empData.error || 'Erro ao registar empresa parceira');
        setLoading(false);
        return;
      }

      // Redirecciona directamente para o dashboard do Patrocinador
      router.push('/patrocinador/dashboard');
    } catch {
      setError('Erro de ligação. Verifique a sua internet.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* Lado Esquerdo — Branding Patrocinador */}
        <div className={styles.brandSide} style={{ background: 'linear-gradient(135deg, var(--facim-dark) 0%, #1a202c 100%)' }}>
          <div className={styles.brandContent}>
            <span className={styles.brandEyebrow} style={{ color: 'var(--facim-gold)' }}>Parceiro Institucional</span>
            <h1 className={styles.brandTitle}>
              Seja Patrocinador da <span style={{ color: 'var(--facim-gold)' }}>FACIM</span>
            </h1>
            <p className={styles.brandDesc}>
              Faça parte do maior evento de negócios de Moçambique. Associe a sua marca à excelência e promova conexões inigualáveis no mercado nacional e internacional.
            </p>
            <div className={styles.brandDeco} style={{ background: 'var(--facim-gold)' }}></div>
            <div className={styles.brandDeco2}></div>
          </div>
        </div>

        {/* Lado Direito — Formulário */}
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            
            <div className={styles.steps}>
              <div className={`${styles.step} ${step === 1 ? styles.stepActive : step > 1 ? styles.stepDone : ''}`}>
                <div className={styles.stepDot} style={step === 1 ? {background: 'var(--facim-gold)'} : {}}>{step > 1 ? '✓' : '1'}</div>
                <span className={styles.stepLabel}>Representante</span>
              </div>
              <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}>
                <div className={styles.stepDot} style={step === 2 ? {background: 'var(--facim-gold)'} : {}}>2</div>
                <span className={styles.stepLabel}>Empresa</span>
              </div>
            </div>

            <div className={styles.formHeader}>
              <h2>{step === 1 ? 'Dados Pessoais' : 'Informação da Entidade'}</h2>
              <p>{step === 1 ? 'Registe-se como representante legal do patrocínio.' : 'Dados da empresa ou instituição parceira.'}</p>
            </div>

            {error && (
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <i className="ti ti-alert-triangle alert-icon" aria-hidden="true" style={{ color: 'var(--facim-orange)' }}></i>
                <div>
                  <div className="alert-title">Atenção</div>
                  <div className="alert-text">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {step === 1 && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input className="form-input" type="text" placeholder="O seu nome" value={formData.name} onChange={(e) => updateField('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Corporativo *</label>
                    <input className="form-input" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone Directo</label>
                    <input className="form-input" type="text" placeholder="+258 8X XXX XXXX" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Palavra-passe *</label>
                    <div className={styles.passwordField}>
                      <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={formData.password} onChange={(e) => updateField('password', e.target.value)} required />
                      <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                        <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmar Palavra-passe *</label>
                    <input className="form-input" type="password" placeholder="Repita a palavra-passe" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '8px', background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)' }}>
                    Avançar para a Empresa →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nome da Empresa *</label>
                      <input className="form-input" type="text" placeholder="Ex: ABC Lda." value={formData.nomeEmpresa} onChange={(e) => updateField('nomeEmpresa', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">NUIT *</label>
                      <input className="form-input" type="text" placeholder="400XXXXXXX" value={formData.nuit} onChange={(e) => updateField('nuit', e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Sector de Actividade *</label>
                      <select className="form-select" value={formData.sector} onChange={(e) => updateField('sector', e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        {SECTORES_ACTIVIDADE.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Distrito Sede *</label>
                      <select className="form-select" value={formData.distrito} onChange={(e) => updateField('distrito', e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        {DISTRITOS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Telefone Geral</label>
                      <input className="form-input" type="text" placeholder="+258 21 XXX XXX" value={formData.telefoneEmpresa} onChange={(e) => updateField('telefoneEmpresa', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Geral</label>
                      <input className="form-input" type="email" placeholder="geral@empresa.com" value={formData.emailEmpresa} onChange={(e) => updateField('emailEmpresa', e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
                      ← Voltar
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 2, background: 'var(--facim-gold)', borderColor: 'var(--facim-gold)' }}>
                      {loading ? 'A Registar...' : (
                        <><i className="ti ti-star" aria-hidden="true"></i> Criar Conta de Patrocinador</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className={styles.formFooter}>
              <p>
                Já é parceiro oficial?{' '}
                <Link href="/patrocinador/login" style={{ color: 'var(--facim-gold)', fontWeight: 600, textDecoration: 'none' }}>
                  Iniciar sessão
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
