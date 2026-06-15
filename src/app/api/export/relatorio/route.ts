import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import ExcelJS from 'exceljs';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acesso Negado' }, { status: 403 });
    }

    const [empresas, patrocinios] = await Promise.all([
      prisma.empresa.findMany({ include: { candidatura: true } }),
      prisma.patrocinio.findMany({ include: { empresa: true, pacote: true } })
    ]);

    const workbook = new ExcelJS.Workbook();
    
    // TAB 1: Resumo Executivo
    const wsResumo = workbook.addWorksheet('Resumo Executivo');
    wsResumo.columns = [
      { header: 'Métrica', key: 'metrica', width: 40 },
      { header: 'Valor', key: 'valor', width: 20 },
    ];
    wsResumo.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    wsResumo.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A0A00' } };
    
    const aprovadas = empresas.filter(e => e.candidatura?.estado === 'APROVADA').length;
    const pendentes = empresas.filter(e => e.candidatura?.estado === 'PENDENTE').length;

    wsResumo.addRows([
      { metrica: 'Total de Empresas Registadas', valor: empresas.length },
      { metrica: 'Candidaturas Aprovadas (Expositores)', valor: aprovadas },
      { metrica: 'Candidaturas Pendentes', valor: pendentes },
      { metrica: 'Total de Patrocinadores Activos', valor: patrocinios.length },
    ]);

    // TAB 2: Expositores
    const wsExpositores = workbook.addWorksheet('Expositores');
    wsExpositores.columns = [
      { header: 'Empresa', key: 'nome', width: 35 },
      { header: 'Sector', key: 'sector', width: 25 },
      { header: 'Estado', key: 'estado', width: 20 },
    ];
    wsExpositores.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    wsExpositores.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A0A00' } };
    
    empresas.forEach(emp => {
      wsExpositores.addRow({
        nome: emp.nome,
        sector: emp.sectorActividade,
        estado: emp.candidatura?.estado || 'NÃO INICIADA'
      });
    });

    // Apply styles to both tabs
    [wsResumo, wsExpositores].forEach(ws => {
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Relatorio_Geral_FACIM2026.xlsx"'
      }
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Erro ao gerar o ficheiro' }, { status: 500 });
  }
}
