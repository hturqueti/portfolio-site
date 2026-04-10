import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { getAllPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5)

  return (
    <>
      <section className="hero container">
        <span className="eyebrow">Disponível para novos projetos</span>
        <h1>
          Ciência de dados e <span className="gradient-text">analytics</span>
        </h1>
        <p className="hero-copy">
          Portfólio de projetos e estudos em dados, com foco em clareza técnica,
          explicação didática e impacto de negócio.
        </p>
        <div className="hero-actions">
          <Link href="/blog" className="button button-primary">
            Ver posts
          </Link>
          <a href="https://github.com/hturqueti" className="button button-secondary">
            GitHub
          </a>
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Conteúdo recente</p>
            <h2>Posts mais recentes</h2>
          </div>
          <Link href="/blog" className="inline-link">
            Ver todos
          </Link>
        </div>

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="container section about-grid">
        <div className="surface-card">
          <p className="section-kicker">Resumo</p>
          <h2>Base funcional para seu novo site</h2>
          <p>
            Esta primeira versão já vem pronta para você publicar no Cloudflare Pages,
            versionar no GitHub e começar a escrever posts em MDX com frontmatter.
          </p>
        </div>

        <div className="surface-card">
          <p className="section-kicker">Próximos upgrades</p>
          <ul className="feature-list">
            <li>Syntax highlighting com Shiki</li>
            <li>Paginação</li>
            <li>Componentes React dentro dos posts</li>
            <li>Gráficos Plotly client-side</li>
          </ul>
        </div>
      </section>
    </>
  )
}
