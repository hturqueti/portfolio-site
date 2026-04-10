# Portfolio Site

Base pronta de um site pessoal com blog em Markdown usando Next.js App Router e exportação estática.

## Stack

- Next.js
- TypeScript
- App Router
- Markdown local com frontmatter
- Cloudflare Pages (static export)

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Build de produção

```bash
npm run build
```

A saída estática será gerada na pasta `out/`.

## Estrutura

```text
app/
  blog/
    [slug]/page.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
content/
  posts/
lib/
```

## Como publicar no Cloudflare Pages

Use estas configurações:

- Framework preset: **Next.js (Static HTML Export)**
- Build command: **npx next build**
- Build output directory: **out**

## Como criar um novo post

Crie um arquivo `.md` em `content/posts` com frontmatter.

Exemplo:

```md
---
title: "Novo post"
description: "Resumo do conteúdo"
date: "2026-04-10"
tags:
  - dados
  - python
---

# Novo post

Conteúdo aqui.
```

## Próximos passos sugeridos

- Adicionar Shiki para syntax highlighting
- Migrar posts para MDX
- Adicionar paginação
- Criar componentes de projeto separados do blog
