# Guia Técnico de Implantação e Alojamento (Hosting Deployment Manual)
**Aplicação:** FACIM 2026 - Província de Maputo  
**Tecnologia:** Next.js 16 (Node.js 18+), Prisma ORM, PostgreSQL  
**Data da Build:** 2026-08-28  

---

## 📦 Pacotes Disponíveis para Alojamento

No arquivo entregue, a equipe de alojamento/sysadmin encontrará dois pacotes ZIP:

1. **`facim-deploy-standalone.zip` (Recomendado para Servidores VPS / Linux / cPanel Node app)**
   - Contém a aplicação já compilada de forma autocontida (`standalone`), necessitando apenas do runtime de Node.js no servidor.
   - Não requer compilação (`npm run build`) no servidor de produção.

2. **`facim-source-code.zip` (Para implantação via Git / Vercel / Netlify)**
   - Contém todo o código fonte limpo para ambientes com CI/CD ou compilação remota.

---

## 🚀 Opção A: Implantação com Pacote Standalone (VPS / Servidor Linux / Docker)

### Requisitos do Servidor
- **Node.js**: v18.17.0 ou superior (v20 LTS recomendada)
- **Gerenciador de Processos**: PM2 (`npm install -g pm2`)
- **Web Server / Proxy Reverso**: Nginx
- **Banco de Dados**: PostgreSQL (v13+)

### Passo a Passo de Instalação

1. **Descompactar o Pacote**
   Descompacte o arquivo `facim-deploy-standalone.zip` na pasta de destino no servidor (ex: `/var/www/facim`).

   ```bash
   unzip facim-deploy-standalone.zip -d /var/www/facim
   cd /var/www/facim
   ```

2. **Configurar as Variáveis de Ambiente (`.env`)**
   Crie o arquivo `.env` na raiz da pasta extraída tomando como base o modelo `.env.example`:

   ```bash
   cp .env.example .env
   nano .env
   ```

   Preencha os valores reais de produção:
   - `DATABASE_URL`: String de conexão com o banco de dados PostgreSQL.
   - `JWT_SECRET`: Chave aleatória forte de segurança.
   - `NEXT_PUBLIC_APP_URL`: URL oficial do site (ex: `https://facim.gov.mz`).

3. **Migração / Criação da Estrutura do Banco de Dados PostgreSQL**
   O projeto inclui o arquivo **`prisma/schema_dump.sql`** contendo todo o script de criação da estrutura de tabelas, tipos ENUM, chaves primárias e relacionamentos do PostgreSQL.

   A equipe pode importar o script diretamente via `psql` ou pgAdmin:
   ```bash
   psql -U usuario_db -d nome_banco -f prisma/schema_dump.sql
   ```

   Alternativamente, utilizando a CLI do Prisma:
   ```bash
   npx prisma db push
   ```

4. **Iniciar a Aplicação com PM2**
   O pacote inclui o arquivo `ecosystem.config.js` pré-configurado. Execute:

   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

   *(A aplicação estará escutando por padrão na porta `3000`)*.

---

## 🌐 Configuração do Proxy Reverso (Nginx)

Para expor a aplicação com SSL/HTTPS na porta padrão HTTP/HTTPS (`80` / `443`), configure um bloco de servidor no Nginx:

`/etc/nginx/sites-available/facim`

```nginx
server {
    listen 80;
    server_name facim.gov.mz www.facim.gov.mz;

    # Redirecionamento HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name facim.gov.mz www.facim.gov.mz;

    ssl_certificate /etc/letsencrypt/live/facim.gov.mz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/facim.gov.mz/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20M;
}
```

Ative o site e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/facim /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔄 Opção B: Implantação Vercel / Netlify / Cloud PaaS

Se a equipe utilizar Vercel ou plataforma PaaS similar:

1. Importe o código contido em `facim-source-code.zip` no repositório Git.
2. Defina o **Framework Preset** como `Next.js`.
3. Adicione as variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`) nas configurações da Vercel.
4. O comando de Build padrão é `npm run build`.

---

## 📞 Suporte Técnico

Para dúvidas sobre a arquitetura ou configuração do projeto, consulte a equipe de desenvolvimento.
