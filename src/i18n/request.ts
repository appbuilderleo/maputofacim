import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  // Se não houver locale ou for inválido, usa o padrão
  if (!locale || !(routing.locales as unknown as string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }
  
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
