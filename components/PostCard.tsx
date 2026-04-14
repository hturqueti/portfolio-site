import Image from 'next/image'
import type { PostMeta } from '@/lib/posts'
import { ScrollTopLink } from '@/components/ScrollTopLink'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="post-card">
      <ScrollTopLink href={`/blog/${post.slug}`} className="card-link-overlay" aria-label={`Abrir post ${post.title}`} />
      <div className="post-meta">
        <span>{post.dateLabel}</span>
        <span>{post.readingTime}</span>
      </div>

      <div className="post-card-heading">
        {post.image ? (
          <Image
            src={post.image}
            alt=""
            width={72}
            height={72}
            className="post-card-thumb"
          />
        ) : null}

        <h3>{post.title}</h3>
      </div>

      <p>{post.description}</p>

      <div className="post-card-footer">
        <div className="tag-list">
          {post.tags.map((tag) => (
            <ScrollTopLink key={tag} href={`/busca?q=%23${encodeURIComponent(tag)}`} className="tag interactive-tag">
              #{tag}
            </ScrollTopLink>
          ))}
        </div>
      </div>
    </article>
  )
}
