'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Utilitário para forçar actualização da página em tempo real.
 * Usado para fazer polling silencioso e actualizar os dados do Server Component sem piscar o ecrã.
 */
export default function RealTimeRefresher({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    // Em modo de desenvolvimento, polling frequente causa lentidão extrema.
    // Vamos desativar o auto-refresh no modo dev ou usar um intervalo muito longo.
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const interval = setInterval(() => {
      router.refresh(); // Actualiza o estado no servidor silenciosamente
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
