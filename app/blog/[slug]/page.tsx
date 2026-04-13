import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getSingletonHighlighter } from 'shiki'
import { mdxComponents } from '@/components/mdx-components'
import { transformObsidianCallouts } from '@/lib/mdx-callouts'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripLeadingTitleHeading(content: string, title: string) {
  const trimmed = content.trimStart()
  const headingPattern = new RegExp(`^#\\s+${escapeRegExp(title)}\\s*\\n+`, 'i')

  if (headingPattern.test(trimmed)) {
    return trimmed.replace(headingPattern, '')
  }

  return content
}

const codeLanguages = ['bash', 'css', 'docker', 'html', 'json', 'markdown', 'powershell', 'python', 'sql'] as const

const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: false,
  defaultLang: 'text',
  getHighlighter: () =>
    getSingletonHighlighter({
      themes: ['github-dark'],
      langs: [...codeLanguages],
    }),
  onVisitLine(node: { children: Array<unknown> }) {
    if (node.children.length === 0) {
      node.children.push({ type: 'text', value: ' ' })
    }
  },
}

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
    source: transformObsidianCallouts(stripLeadingTitleHeading(post.content, post.title)),
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkMath, { singleDollarTextMath: false }]],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, [rehypePrettyCode, prettyCodeOptions]],
      },
    },
  })

  return (
    <article className="container article-shell">
      <header className="article-header">
        <div className="article-header-main">
          {post.image ? (
            <Image
              src={post.image}
              alt=""
              width={120}
              height={120}
              className="article-thumb"
              priority
            />
          ) : null}

          <div className="article-header-copy">
            <p className="section-kicker">{post.dateLabel}</p>
            <h1>{post.title}</h1>
            <p className="article-description">{post.description}</p>
            {post.tags.length > 0 ? (
              <div className="tag-list">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/busca?q=%23${encodeURIComponent(tag)}`} className="tag interactive-tag">
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="article-body markdown-body">
        {content}
      </div>
    </article>
  )
}
