import { PostCard } from '@/components/PostCard'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  title: 'Blog | Henrique Marques Turqueti',
  description: 'Posts técnicos e estudos sobre ciência de dados e analytics.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <section className="container section">
      <div className="section-header section-header-stack">
        <div>
          <p className="section-kicker">Blog</p>
          <h1>Todos os posts</h1>
          <p className="section-copy">
            Conteúdo versionado em Git, escrito em MDX e gerado como site estático com Next.js.
          </p>
        </div>
      </div>

      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
