import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const empresas = await prisma.empresa.findMany({
    include: {
      candidatura: true,
      user: { select: { email: true, name: true } }
    }
  });

  const header = ['ID', 'Nome', 'NUIT', 'Sector', 'Distrito', 'Telefone', 'Email', 'Responsavel', 'Estado Candidatura', 'Data de Registo'].join(';');
  const rows = empresas.map(emp => {
    return [
      emp.id,
      `"${emp.nome}"`,
      emp.nuit,
      `"${emp.sectorActividade}"`,
      `"${emp.distrito}"`,
      emp.telefone,
      emp.email,
      `"${emp.user.name}"`,
      emp.candidatura?.estado || 'NAO_INICIADA',
      emp.createdAt.toISOString()
    ].join(';');
  });

  const csvContent = [header, ...rows].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="expositores_facim2026.csv"'
    }
  });
}
