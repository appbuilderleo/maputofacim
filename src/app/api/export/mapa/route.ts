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

    const candidaturas = await prisma.candidatura.findMany({
      where: {
        estado: 'APROVADA',
      },
      include: {
        empresa: true,
      },
      orderBy: { dataAprovacao: 'asc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mapa de Stands');

    // Define Columns
    worksheet.columns = [
      { header: 'Empresa', key: 'nome', width: 35 },
      { header: 'Sector', key: 'sector', width: 25 },
      { header: 'Tipo de Stand', key: 'tipo', width: 20 },
      { header: 'Área (m²)', key: 'area', width: 15 },
      { header: 'Produtos a Exibir', key: 'produtos', width: 40 },
      { header: 'Necessidades Extra', key: 'necessidades', width: 40 },
      { header: 'Contacto (Telefone)', key: 'telefone', width: 20 },
      { header: 'Data Aprovação', key: 'data', width: 15 },
    ];

    // Style the Header Row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A0A00' } // facim-dark
    };

    // Add Data Rows
    candidaturas.forEach((cand) => {
      worksheet.addRow({
        nome: cand.empresa.nome,
        sector: cand.empresa.sectorActividade,
        tipo: cand.tipoStand || 'Não especificado',
        area: cand.areaDesejada ? `${cand.areaDesejada} m²` : '-',
        produtos: cand.produtosExibir || '-',
        necessidades: cand.necessidades || '-',
        telefone: cand.empresa.telefone,
        data: cand.dataAprovacao ? new Date(cand.dataAprovacao).toLocaleDateString('pt-PT') : '-',
      });
    });

    // Apply borders, alignment, and text wrapping
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (rowNumber > 1) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Mapa_Stands_Ocupacao_FACIM2026.xlsx"'
      }
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Erro ao gerar o ficheiro' }, { status: 500 });
  }
}
