import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Corresponde apenas às rotas internacionalizadas
  matcher: ['/', '/(pt|en|es|fr|zh|ru)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
