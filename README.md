# Portfolio Site

Site pessoal estático construído com Next.js App Router, MDX local e deploy em Cloudflare Pages.

O projeto hoje reúne:

- homepage institucional;
- blog com posts em `content/posts/*.mdx`;
- listagem de projetos usando o mesmo pipeline de conteúdo;
- renderização estática de páginas individuais em `app/blog/[slug]`;
- componentes MDX próprios para callouts, figuras com legenda e gráficos Plotly.

## Stack

- Next.js 16
- React 19
- TypeScript
- MDX com `next-mdx-remote`
- frontmatter com `gray-matter`
- GFM com `remark-gfm`
- syntax highlighting com `rehype-pretty-code` + Shiki
- gráficos interativos com Plotly
- export estático para Cloudflare Pages

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build

```bash
npm run build
```

A saída estática é gerada em `out/`.

## Estrutura

```text
app/
  blog/
    [slug]/page.tsx
    page.tsx
  busca/page.tsx
  contato/page.tsx
  projetos/page.tsx
  sobre/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
content/
  plots/
    <post-slug>/
  posts/
  templates/
lib/
public/
  images/
    branding/
    companies/
    education/
    icons/
    posts/
      covers/
    profile/
```

Hoje, dentro de `public/images/`, as divisões principais são:

- `branding/`: logo e ativos de marca do site
- `companies/`: logos de empresas usadas na página Sobre
- `education/`: logos e imagens ligadas à formação acadêmica
- `icons/`: ícones SVG do projeto, incluindo os usados em callouts
- `posts/`: imagens ligadas a conteúdo editorial
- `posts/covers/`: capas de posts e projetos
- `profile/`: imagem principal de perfil

## Tipos De Conteúdo

Hoje existem dois tipos principais de conteúdo:

1. `post`
2. `project`

Ambos vivem em `content/posts/` e são diferenciados pelo campo `contentType` no frontmatter.

Templates de referência:

- Post: [content/templates/post-template.mdx](/C:/Users/Henrique/Projetos/portfolio-site/content/templates/post-template.mdx)
- Projeto: [content/templates/project-template.mdx](/C:/Users/Henrique/Projetos/portfolio-site/content/templates/project-template.mdx)

Os mesmos exemplos também podem ser visualizados copiando os arquivos para `content/posts/`.

## Frontmatter

Campos comuns:

```yaml
title: "Titulo"
description: "Resumo curto"
date: "2026-04-13"
tags:
  - exemplo
image: "/images/posts/covers/exemplo.webp"
imagePosition: "center"
contentType: "post" # ou "project"
featured: false
featuredOrder: 99
```

Campos adicionais usados por `project`:

```yaml
stack:
  - Python
  - SQL
results:
  - "Resultado principal"
  - "Outro resultado"
```

## Componentes MDX Disponíveis

Além de Markdown e GFM, o site suporta componentes MDX registrados em [components/mdx-components.tsx](/C:/Users/Henrique/Projetos/portfolio-site/components/mdx-components.tsx):

- `MdxCallout`
- `MdxFigure`
- `PlotlyChart`

Exemplos de uso:

```mdx
<MdxFigure
  src="/images/posts/olist_erd.svg"
  alt="Diagrama entidade-relacionamento das tabelas disponibilizadas no Kaggle"
  caption="Diagrama entidade-relacionamento das tabelas disponibilizadas no Kaggle"
/>
```

```mdx
<PlotlyChart
  src="modelo-de-churn-end-to-end/distribuicao-de-probabilidade-de-churn.json"
  alt="Grafico interativo de valor de pedidos por estado e status"
  caption="Grafico interativo de valor de pedidos por estado e status."
/>
```

## Callouts

O site suporta dois formatos:

1. componente MDX explícito com `MdxCallout`;
2. sintaxe de callout do Obsidian:

```md
> [!tip] Dica
>
> Conteudo do callout.
```

Também há suporte a callouts recolhíveis:

```md
> [!warning]- Fechado por padrao
>
> Conteudo
```

```md
> [!success]+ Aberto por padrao
>
> Conteudo
```

Tipos principais suportados:

- `note`
- `info`
- `todo`
- `question`
- `example`
- `abstract`
- `quote`
- `tip`
- `success`
- `warning`
- `failure`
- `danger`
- `bug`

## Paleta De Cores

Definida em [app/globals.css](/C:/Users/Henrique/Projetos/portfolio-site/app/globals.css):

- `--color-primary`: `#e00450`
- `--color-secondary`: `#fd6a31`
- `--color-bg`: `#fefefc`
- `--color-text`: `#030303`
- `--color-muted`: `#595959`
- `--color-surface`: `#f6f6f6`
- `--color-border`: `rgba(3, 3, 3, 0.08)`

Agrupamento atual de cores dos callouts:

- azul: `note`, `info`, `todo`, `question`, `example`
- cinza: `quote`, `abstract`
- verde: `success`, `tip`
- amarelo: `warning`
- vermelho: `danger`, `bug`, `failure`

## Convenção De Imagens

As imagens devem ficar em `public/images/posts/`.

Para evitar conflito de nomes entre posts diferentes, a convenção recomendada é usar uma pasta por slug:

```text
public/images/posts/modelo-de-churn-end-to-end/diagrama-tabelas.webp
public/images/posts/primeiro-post/diagrama-tabelas.webp
```

Assim você pode repetir nomes de arquivo sem colisão.

## Convenção De Plots

Os arquivos JSON de gráficos devem ficar em `content/plots/`.

Para evitar conflito de nomes entre posts diferentes, a convenção recomendada é usar uma pasta por slug, seguindo a mesma ideia das imagens:

```text
content/plots/modelo-de-churn-end-to-end/distribuicao-de-probabilidade-de-churn.json
content/plots/primeiro-post/valores-por-categoria.json
```

O `src` usado no componente `PlotlyChart` deve apontar para esse caminho relativo dentro de `content/plots/`.

## Ícones

Os ícones usados no projeto são baseados em Tabler Icons:

- Fonte: https://tabler.io/icons

Convenção atual de `stroke-width`:

- `1.75` para os ícones usados pelos callouts em `public/images/icons/`
- mantenha `1.75` ao adicionar novos ícones destinados a callouts

Ícones atualmente usados por callouts:

- `note.svg`
- `notes.svg`
- `info-circle.svg`
- `circle-check.svg`
- `bulb.svg`
- `help.svg`
- `alert-triangle.svg`
- `circle-x.svg`
- `skull.svg`
- `bug.svg`
- `blockquote.svg`
- `clipboard-search.svg`

## Deploy No Cloudflare Pages

Configuração esperada:

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npx next build`
- Build output directory: `out`

## Restrições Arquiteturais

- manter compatibilidade com export estático;
- não introduzir SSR, middleware ou rotas de API;
- `app/blog/[slug]` deve continuar estaticamente gerado;
- preferir componentes simples e CSS antes de adicionar dependências grandes.
