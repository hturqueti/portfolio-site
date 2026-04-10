# 🚀 Setup de Portfólio com Blog (Next.js + MDX + Cloudflare Pages)

## 🎯 Objetivo
Construir um site de portfólio moderno com:
- Blog baseado em Markdown (MDX)
- Estrutura escalável
- Deploy no Cloudflare Pages
- Sem backend
- Código limpo e fácil de evoluir

---

## 🧠 Stack Tecnológica
- Next.js (App Router)
- MDX (Markdown + React)
- Tailwind CSS
- Cloudflare Pages

---

## 📁 Estrutura de Pastas

/portfolio-site
  /app
    /blog/[slug]/page.tsx
    layout.tsx
    page.tsx
  /components
    Header.tsx
    PostCard.tsx
  /content/posts
    primeiro-post.mdx
  /lib
    posts.ts
  next.config.mjs
  package.json

---

## ⚙️ Criar projeto

npx create-next-app@latest portfolio-site

Opções:
- App Router: YES
- TypeScript: YES
- Tailwind: YES

---

## ⚙️ Instalar MDX

npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter

---

## ⚙️ Configurar MDX

next.config.mjs:

import withMDX from '@next/mdx'({
  extension: /\.mdx?$/,
})

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}

export default withMDX(nextConfig)

---

## 📄 Primeiro post

/content/posts/primeiro-post.mdx

---
title: "Meu primeiro post"
date: "2026-04-09"
description: "Explorando MDX"
---

# Meu primeiro post

Esse é meu primeiro post 🚀

```python
print("Hello world")
```

---

## ⚙️ Carregar posts

/lib/posts.ts

import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/posts")

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory)

  return files.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)

    return {
      slug: fileName.replace(".mdx", ""),
      ...data,
    }
  })
}
