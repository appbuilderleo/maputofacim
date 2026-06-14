import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, telefone, assunto, mensagem } = body;

    if (!nome || !email || !assunto || !mensagem) {
      return NextResponse.json(
        { error: 'Nome, email, assunto e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    await prisma.mensagemContacto.create({
      data: {
        nome,
        email,
        telefone: telefone || null,
        assunto,
        mensagem,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
