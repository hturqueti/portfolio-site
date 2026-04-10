import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="post-card">
      <div className="post-meta">
        <span>{post.dateLabel}</span>
        <span>{post.readingTime}</span>
      </div>

      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>

      <p>{post.description}</p>

      <div className="post-card-footer">
        <div className="tag-list">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} className="inline-link">
          Ler mais
        </Link>
      </div>
    </article>
  )
}
