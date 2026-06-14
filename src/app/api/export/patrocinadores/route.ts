import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const patrocinios = await prisma.patrocinio.findMany({
    include: {
      empresa: { include: { user: { select: { name: true, email: true } } } },
      pacote: true
    }
  });

  const header = ['Empresa', 'NUIT', 'Responsavel', 'Contacto', 'Pacote', 'Preco', 'Estado', 'Data de Solicitacao'].join(';');
  const rows = patrocinios.map(pat => {
    return [
      `"${pat.empresa.nome}"`,
      pat.empresa.nuit,
      `"${pat.empresa.user.name}"`,
      pat.empresa.telefone,
      `"${pat.pacote.nome}"`,
      pat.pacote.preco?.toString() || '0',
      pat.estado,
      pat.dataSolicitacao.toISOString()
    ].join(';');
  });

  const csvContent = [header, ...rows].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="patrocinadores_facim2026.csv"'
    }
  });
}
