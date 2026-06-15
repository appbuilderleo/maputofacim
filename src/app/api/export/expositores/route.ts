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

    const empresas = await prisma.empresa.findMany({
      include: {
        candidatura: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expositores');

    // Define Columns
    worksheet.columns = [
      { header: 'NUIT', key: 'nuit', width: 15 },
      { header: 'Empresa', key: 'nome', width: 35 },
      { header: 'Sector', key: 'sector', width: 25 },
      { header: 'Distrito', key: 'distrito', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Telefone', key: 'telefone', width: 20 },
      { header: 'Estado Candidatura', key: 'estado', width: 20 },
      { header: 'Data Registo', key: 'data', width: 15 },
    ];

    // Style the Header Row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A0A00' } // facim-dark
    };

    // Add Data Rows
    empresas.forEach((emp) => {
      worksheet.addRow({
        nuit: emp.nuit,
        nome: emp.nome,
        sector: emp.sectorActividade,
        distrito: emp.distrito,
        email: emp.email,
        telefone: emp.telefone,
        estado: emp.candidatura?.estado || 'NÃO INICIADA',
        data: new Date(emp.createdAt).toLocaleDateString('pt-PT'),
      });
    });

    // Apply borders and alignment to all rows
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
        'Content-Disposition': 'attachment; filename="Lista_Expositores_FACIM2026.xlsx"'
      }
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Erro ao gerar o ficheiro' }, { status: 500 });
  }
}
