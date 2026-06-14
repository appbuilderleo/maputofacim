'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <i className="ti ti-world" style={{ fontSize: '20px' }}></i>
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        title={t('label')}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          fontSize: '14px',
          fontWeight: 600,
          color: 'inherit'
        }}
      >
        <option value="pt" style={{ color: 'black' }}>PT</option>
        <option value="en" style={{ color: 'black' }}>EN</option>
        <option value="es" style={{ color: 'black' }}>ES</option>
        <option value="fr" style={{ color: 'black' }}>FR</option>
        <option value="ru" style={{ color: 'black' }}>RU</option>
        <option value="zh" style={{ color: 'black' }}>CN</option>
      </select>
    </label>
  );
}
