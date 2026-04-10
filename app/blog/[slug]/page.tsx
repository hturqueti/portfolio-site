import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { mdxComponents } from '@/components/mdx-components'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params
  const post = getPostBySlug(p.slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  return {
    title: `${post.title} | Henrique Turqueti`,
    description: post.description,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params
  const post = getPostBySlug(p.slug)

  if (!post) {
    notFound()
  }

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  })

  return (
    <article className="container article-shell">
      <header className="article-header">
        <p className="section-kicker">{post.dateLabel}</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        {post.tags.length > 0 ? (
          <div className="tag-list">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="article-body markdown-body">
        {content}
      </div>
    </article>
  )
}
