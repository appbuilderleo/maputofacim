import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const candidaturas = await prisma.candidatura.findMany({
    where: { estado: 'APROVADA' },
    include: { empresa: true }
  });

  const header = ['Empresa', 'Sector', 'Tipo de Stand', 'Area (m2)', 'Necessidades'].join(';');
  const rows = candidaturas.map(cand => {
    return [
      `"${cand.empresa.nome}"`,
      `"${cand.empresa.sectorActividade}"`,
      `"${cand.tipoStand || ''}"`,
      cand.areaDesejada || 0,
      `"${(cand.necessidades || '').replace(/\n/g, ' ')}"`
    ].join(';');
  });

  const csvContent = [header, ...rows].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mapa_stands_facim2026.csv"'
    }
  });
}
