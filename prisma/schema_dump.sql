-- Script SQL de Dump do Banco de Dados PostgreSQL - FACIM 2026
-- Gerado automaticamente para importação direta em qualquer servidor PostgreSQL

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VISITOR', 'EXPOSITOR', 'PATROCINADOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "EstadoCandidatura" AS ENUM ('RASCUNHO', 'PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoPatrocinio" AS ENUM ('INTERESSE', 'EM_ANALISE', 'APROVADO', 'REJEITADO', 'CONFIRMADO');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VISITOR',
    "phone" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "nuit" TEXT NOT NULL,
    "sectorActividade" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "endereco" TEXT,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "redesSociais" JSONB,
    "logotipo" TEXT,
    "descricao" VARCHAR(2000),
    "anoFundacao" INTEGER,
    "numFuncionarios" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidatura" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresaId" UUID NOT NULL,
    "estado" "EstadoCandidatura" NOT NULL DEFAULT 'PENDENTE',
    "tipoStand" TEXT,
    "areaDesejada" DOUBLE PRECISION,
    "produtosExibir" VARCHAR(2000),
    "necessidades" VARCHAR(2000),
    "observacoes" VARCHAR(2000),
    "dataSubmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAprovacao" TIMESTAMP(3),
    "motivoRejeicao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoCandidatura" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidaturaId" UUID NOT NULL,
    "estadoAnterior" TEXT NOT NULL,
    "estadoNovo" TEXT NOT NULL,
    "observacao" TEXT,
    "criadoPor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoCandidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PacotePatrocinio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "preco" DECIMAL(12,2),
    "beneficios" JSONB NOT NULL,
    "limiteVagas" INTEGER,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PacotePatrocinio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patrocinio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresaId" UUID NOT NULL,
    "pacoteId" UUID NOT NULL,
    "estado" "EstadoPatrocinio" NOT NULL DEFAULT 'INTERESSE',
    "observacoes" VARCHAR(2000),
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAprovacao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patrocinio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresaId" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tamanho" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noticia" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumo" VARCHAR(500) NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagem" TEXT,
    "videoLink" TEXT,
    "categoria" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "autorId" UUID NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" TEXT NOT NULL,
    "descricao" VARCHAR(2000),
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "local" TEXT,
    "tipo" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensagemContacto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "assunto" TEXT NOT NULL,
    "mensagem" VARCHAR(2000) NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "respondida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MensagemContacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemGaleria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" TEXT,
    "descricao" TEXT,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemGaleria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_userId_key" ON "Empresa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nuit_key" ON "Empresa"("nuit");

-- CreateIndex
CREATE UNIQUE INDEX "Candidatura_empresaId_key" ON "Candidatura"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "PacotePatrocinio_nome_key" ON "PacotePatrocinio"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Patrocinio_empresaId_key" ON "Patrocinio"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Noticia_slug_key" ON "Noticia"("slug");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoCandidatura" ADD CONSTRAINT "HistoricoCandidatura_candidaturaId_fkey" FOREIGN KEY ("candidaturaId") REFERENCES "Candidatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patrocinio" ADD CONSTRAINT "Patrocinio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patrocinio" ADD CONSTRAINT "Patrocinio_pacoteId_fkey" FOREIGN KEY ("pacoteId") REFERENCES "PacotePatrocinio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
