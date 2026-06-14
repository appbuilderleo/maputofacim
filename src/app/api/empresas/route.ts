import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { nome, nuit, sectorActividade, distrito, telefone, email, website, descricao } = body;

    if (!nome || !nuit || !sectorActividade || !distrito || !telefone || !email) {
      return NextResponse.json(
        { error: 'Campos obrigatórios em falta' },
        { status: 400 }
      );
    }

    // Check if NUIT already exists
    const existing = await prisma.empresa.findUnique({ where: { nuit } });
    if (existing) {
      return NextResponse.json(
        { error: 'Já existe uma empresa registada com este NUIT' },
        { status: 409 }
      );
    }

    const empresa = await prisma.empresa.create({
      data: {
        userId: user.id,
        nome,
        nuit,
        sectorActividade,
        distrito,
        telefone,
        email,
        website: website || null,
        descricao: descricao || null,
      },
    });

    return NextResponse.json({ success: true, empresa }, { status: 201 });
  } catch (error) {
    console.error('Create company error:', error);
    return NextResponse.json(
      { error: 'Erro ao registar empresa' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      // Admins can see all companies
      const empresas = await prisma.empresa.findMany({
        include: {
          candidatura: true,
          patrocinio: { include: { pacote: true } },
          user: { select: { name: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(empresas);
    }

    // Regular users see only their own company
    const empresa = await prisma.empresa.findUnique({
      where: { userId: user.id },
      include: {
        candidatura: true,
        documentos: true,
        patrocinio: { include: { pacote: true } },
      },
    });

    return NextResponse.json(empresa);
  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json({ error: 'Erro ao obter dados' }, { status: 500 });
  }
}
