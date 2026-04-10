import Image from 'next/image'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

export function ProjectCard({ project }: { project: PostMeta }) {
  return (
    <article className="project-card">
      <Link href={`/blog/${project.slug}`} className="card-link-overlay" aria-label={`Abrir projeto ${project.title}`} />

      {project.image ? (
        <Image
          src={project.image}
          alt=""
          width={300}
          height={400}
          className="project-card-thumb"
          style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
        />
      ) : (
        <div className="project-card-thumb project-card-thumb-placeholder" aria-hidden="true" />
      )}

      <div className="project-card-copy">
        <div className="project-card-meta">
          <span className="section-kicker">Projeto</span>
          <span>{project.dateLabel}</span>
        </div>

        <h2>{project.title}</h2>
        <p>{project.description}</p>

        {project.stack.length > 0 ? (
          <div className="project-card-section">
            <span className="section-kicker">Stack</span>
            <div className="tag-list">
              {project.stack.map((item) => (
                <span key={item} className="tag project-stack-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {project.results.length > 0 ? (
          <div className="project-card-section">
            <span className="section-kicker">Resultados</span>
            <ul className="project-results-list">
              {project.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="tag-list">
          {project.tags.map((tag) => (
            <Link key={tag} href={`/busca?q=%23${encodeURIComponent(tag)}`} className="tag interactive-tag">
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
