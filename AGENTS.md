# Agent Instructions

This project is a static personal portfolio built with Next.js App Router and deployed to Cloudflare Pages.

## Architectural rules

- Keep the project static-export compatible.
- Do not introduce server-only features that require SSR.
- Blog posts live in `content/posts/*.md`.
- Post metadata is read from frontmatter.
- Routes under `app/blog/[slug]` must remain statically generated.
- Prefer simple components and CSS over adding large dependencies.

## Safe improvements

- New homepage sections
- Better cards and typography
- Pagination based on static generation
- Tag pages generated at build time
- Shiki syntax highlighting
- Migration from Markdown to MDX

## Avoid unless explicitly requested

- Databases
- Auth
- API routes
- Dynamic rendering
- Middleware
