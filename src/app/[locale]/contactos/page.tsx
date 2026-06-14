'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

import { useTranslations } from 'next-intl';

export default function ContactosPage() {
  const t = useTranslations('Contactos');
  const [formData, setFormData] = useState({
    nome: '', email: '', telefone: '', assunto: '', mensagem: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <span className={styles.eyebrow}>{t('hero.eyebrow')}</span>
          <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
          <p className={styles.heroSub}>
            {t('hero.sub')}
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>{t('form.title')}</h2>
              <p className={styles.formSub}>
                {t('form.sub')}
              </p>

              {status === 'success' && (
                <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                  <i className="ti ti-circle-check alert-icon" aria-hidden="true" style={{ color: 'var(--facim-teal)' }}></i>
                  <div>
                    <div className="alert-title">{t('form.alertSuccessTitle')}</div>
                    <div className="alert-text">{t('form.alertSuccessText')}</div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                  <i className="ti ti-alert-triangle alert-icon" aria-hidden="true" style={{ color: 'var(--facim-gold)' }}></i>
                  <div>
                    <div className="alert-title">{t('form.alertErrorTitle')}</div>
                    <div className="alert-text">{t('form.alertErrorText')}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-nome">{t('form.lblName')}</label>
                    <input
                      id="contact-nome"
                      className="form-input"
                      type="text"
                      placeholder={t('form.plhName')}
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">{t('form.lblEmail')}</label>
                    <input
                      id="contact-email"
                      className="form-input"
                      type="email"
                      placeholder={t('form.plhEmail')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-telefone">{t('form.lblPhone')}</label>
                    <input
                      id="contact-telefone"
                      className="form-input"
                      type="text"
                      placeholder={t('form.plhPhone')}
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-assunto">{t('form.lblSubject')}</label>
                    <input
                      id="contact-assunto"
                      className="form-input"
                      type="text"
                      placeholder={t('form.plhSubject')}
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-mensagem">{t('form.lblMessage')}</label>
                  <textarea
                    id="contact-mensagem"
                    className="form-textarea"
                    placeholder={t('form.plhMessage')}
                    rows={5}
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>{t('form.btnSending')}</>
                  ) : (
                    <>
                      <i className="ti ti-send" aria-hidden="true"></i>
                      {t('form.btnSend')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="ti ti-map-pin" aria-hidden="true"></i>
                </div>
                <h3>{t('info.addressTitle')}</h3>
                <p>{t('info.addressLine1')}<br/>{t('info.addressLine2')}<br/>{t('info.addressLine3')}</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon} style={{ background: 'var(--badge-teal-bg)', color: 'var(--facim-teal)' }}>
                  <i className="ti ti-phone" aria-hidden="true"></i>
                </div>
                <h3>{t('info.phoneTitle')}</h3>
                <p>+258 21 720 000<br/>+258 84 XXX XXXX</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon} style={{ background: 'var(--badge-blue-bg)', color: 'var(--facim-blue)' }}>
                  <i className="ti ti-mail" aria-hidden="true"></i>
                </div>
                <h3>{t('info.emailTitle')}</h3>
                <p>facim@dpic-maputo.gov.mz<br/>info@dpic-maputo.gov.mz</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon} style={{ background: 'var(--badge-gold-bg)', color: '#7A4A00' }}>
                  <i className="ti ti-clock" aria-hidden="true"></i>
                </div>
                <h3>{t('info.timeTitle')}</h3>
                <p>{t('info.timeLine1')}<br/>{t('info.timeLine2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
