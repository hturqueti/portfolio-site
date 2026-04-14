import { BackHomeButton } from '@/components/BackHomeButton'
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
          <p className="eyebrow">Blog</p>
          <h1>
            Todos os <span className="gradient-text">posts</span>
          </h1>
          <p className="section-copy">
            Artigos sobre dados, analytics e IA com foco em raciocínio analítico, aplicação prática e comunicação clara de conceitos, métodos e resultados.
          </p>
          <BackHomeButton />
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
