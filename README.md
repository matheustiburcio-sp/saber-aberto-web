# Saber Aberto — Plataforma Web

Plataforma web do projeto **Saber Aberto**, desenvolvida como parte do trabalho A3 da faculdade. Permite que usuários se cadastrem, façam login e se inscrevam em programas educacionais.

## 🌐 Acesso ao site

**https://saber-aberto-web.matheus-tiburcio.workers.dev**

## 🛠️ Tecnologias utilizadas

- **React** com [TanStack Start](https://tanstack.com/start) (SSR)
- **TypeScript**
- **Vite** + [@cloudflare/vite-plugin](https://github.com/cloudflare/workers-sdk)
- **Supabase** — autenticação e banco de dados (PostgreSQL)
- **Cloudflare Workers** — hospedagem e deploy
- **shadcn/ui** + **Tailwind CSS** — interface

## 📋 Funcionalidades

- Cadastro e login de usuários
- Página de programas educacionais com filtros por categoria e nível
- Inscrição em programas (salvo no banco de dados)
- Logout

## 🗄️ Banco de dados (Supabase)

Tabelas criadas:
- `profiles` — perfil de cada usuário (criado automaticamente no cadastro)
- `enrollments` — inscrições dos usuários nos programas

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Criar arquivo .env com as credenciais do Supabase
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_aqui

# Iniciar em modo desenvolvimento
npm run dev
```

## 📦 Deploy

```bash
npm run deploy
```

O comando executa o build com Vite e faz deploy automaticamente no Cloudflare Workers.

## 👥 Integrantes do grupo

- Matheus Tibúrcio

---

Projeto A3 — 2026.1
