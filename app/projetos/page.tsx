import { ProjectCard } from '@/components/ProjectCard'
import { getAllProjects } from '@/lib/posts'

export const metadata = {
  title: 'Projetos | Henrique Marques Turqueti',
  description: 'Projetos completos de dados, modelagem e analytics do problema ao resultado.',
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <section className="container section projects-page">
      <div className="section-header section-header-stack">
        <div>
          <p className="eyebrow">Projetos</p>
          <h1>
            Casos end-to-end com mais <span className="gradient-text">contexto e profundidade</span>
          </h1>
          <p className="section-copy">
            Projetos completos de análise, modelagem e solução de problemas reais, com foco em raciocínio, execução e
            impacto final.
          </p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="surface-card projects-empty-state">
          <p className="section-kicker">Em breve</p>
          <h2>Os projetos destacados vão aparecer aqui</h2>
          <p>
            Quando um conteúdo receber <code>contentType: &quot;project&quot;</code> no frontmatter, ele entra
            automaticamente nesta página sem deixar de aparecer no blog.
          </p>
        </div>
      )}
    </section>
  )
}
