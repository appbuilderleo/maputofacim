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

    const patrocinios = await prisma.patrocinio.findMany({
      include: {
        empresa: true,
        pacote: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Patrocinadores');

    // Define Columns
    worksheet.columns = [
      { header: 'Empresa', key: 'nome', width: 35 },
      { header: 'NUIT', key: 'nuit', width: 15 },
      { header: 'Pacote', key: 'pacote', width: 25 },
      { header: 'Nível', key: 'nivel', width: 15 },
      { header: 'Valor Pago', key: 'valor', width: 15 },
      { header: 'Estado', key: 'estado', width: 20 },
      { header: 'Contacto Email', key: 'email', width: 30 },
      { header: 'Data Solicitação', key: 'data', width: 15 },
    ];

    // Style the Header Row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A0A00' } // facim-dark
    };

    // Add Data Rows
    patrocinios.forEach((pat) => {
      worksheet.addRow({
        nome: pat.empresa.nome,
        nuit: pat.empresa.nuit,
        pacote: pat.pacote.nome,
        nivel: pat.pacote.nivel,
        valor: pat.pacote.preco ? `${pat.pacote.preco} MZN` : '-',
        estado: pat.estado,
        email: pat.empresa.email,
        data: new Date(pat.createdAt).toLocaleDateString('pt-PT'),
      });
    });

    // Apply borders and alignment
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Patrocinadores_FACIM2026.xlsx"'
      }
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Erro ao gerar o ficheiro' }, { status: 500 });
  }
}
