import Image from 'next/image'
import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { ProjectCard } from '@/components/ProjectCard'
import { getAllPosts, getFeaturedProjects } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5)
  const projects = getFeaturedProjects(2)

  return (
    <>
      <section className="hero container">
        <div className="hero-logo-wrap">
          <Image
            src="/images/branding/logo.svg"
            alt="Logo do site Henrique Turqueti"
            width={150}
            height={150}
            priority
            className="hero-logo"
          />
        </div>

        <div className="hero-copy-wrap">
          <h1>
            Dados e <span className="gradient-text">Analytics</span>
          </h1>
          <p className="hero-copy">
            Projetos, análises e aplicações em dados com foco em simplicidade, clareza e impacto.
          </p>
          <div className="hero-actions">
            <Link href="/blog" className="button button-primary">
              <span className="button-icon button-icon-posts" aria-hidden="true" />
              Ver posts
            </Link>
            <Link href="/projetos" className="button button-primary">
              <span className="button-icon button-icon-projects" aria-hidden="true" />
              Ver projetos
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <div>
            <h2>Posts mais recentes</h2>
          </div>
          <Link href="/blog" className="inline-link">
            Ver todos os posts
          </Link>
        </div>

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="container section home-projects-section">
        <div className="section-header section-header-stack home-projects-header">
          <div>
            <h2>Projetos em destaque</h2>
            <p className="section-copy">
              Casos com mais profundidade, cobrindo contexto, abordagem analítica, modelagem e resultados.
            </p>
          </div>
          <Link href="/projetos" className="inline-link">
            Ver todos os projetos
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="surface-card projects-empty-state">
            <p className="section-kicker">Sem destaques</p>
            <h2>Escolha quais projetos quer destacar na home</h2>
            <p>
              Marque o frontmatter de um projeto com <code>featured: true</code> e, se quiser controlar a ordem, use
              também <code>featuredOrder</code>.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
