'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react'
import type { SearchDocument } from '@/lib/posts'
import { getTagSuggestions, searchPosts, sortSearchResults, type SearchSort } from '@/lib/search'

type SearchPageClientProps = {
  documents: SearchDocument[]
}

const sortOptions: Array<{ value: SearchSort; label: string }> = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'date_desc', label: 'Data: mais recentes' },
  { value: 'date_asc', label: 'Data: mais antigas' },
  { value: 'title_asc', label: 'Título: A-Z' },
  { value: 'title_desc', label: 'Título: Z-A' },
]

function getValidSort(value: string | null): SearchSort {
  return sortOptions.some((option) => option.value === value) ? (value as SearchSort) : 'relevance'
}

export function SearchPageClient({ documents }: SearchPageClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const queryFromUrl = searchParams.get('q') ?? ''
  const sortFromUrl = getValidSort(searchParams.get('sort'))

  const [query, setQuery] = useState(queryFromUrl)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    setQuery(queryFromUrl)
  }, [queryFromUrl])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmedQuery = query.trim()

      if (trimmedQuery) {
        params.set('q', trimmedQuery)
      } else {
        params.delete('q')
      }

      if (sortFromUrl === 'relevance') {
        params.delete('sort')
      } else {
        params.set('sort', sortFromUrl)
      }

      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname

      if (nextUrl === currentUrl) {
        return
      }

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    }, 180)

    return () => window.clearTimeout(timeoutId)
  }, [pathname, query, router, searchParams, sortFromUrl])

  const results = useMemo(() => {
    const matched = searchPosts(documents, deferredQuery)
    return sortSearchResults(matched, sortFromUrl)
  }, [deferredQuery, documents, sortFromUrl])

  const tagSuggestions = useMemo(() => getTagSuggestions(documents, deferredQuery, 8), [documents, deferredQuery])

  return (
    <section className="container section search-page">
      <div className="section-header section-header-stack">
        <div>
          <p className="eyebrow">Busca</p>
          <h1>
            Encontre posts por <span className="gradient-text">tema, termo ou contexto</span>
          </h1>
          <p className="section-copy">
            A busca considera título, tags e conteúdo dos posts, então consultas como &quot;python estatística&quot; também
            encontram textos que contenham esses termos em partes diferentes do post.
          </p>
        </div>
      </div>

      <div className="search-page-controls surface-card">
        <label className="search-control">
          <span className="search-control-label">Buscar</span>
          <input
            type="search"
            className="search-input search-input-page"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Digite termos como python, estatística, analytics..."
            aria-label="Buscar posts"
          />
        </label>

        <label className="search-control search-sort-control">
          <span className="search-control-label">Ordenar por</span>
          <select
            className="search-select"
            value={sortFromUrl}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams.toString())
              const nextSort = getValidSort(event.target.value)

              if (nextSort === 'relevance') {
                params.delete('sort')
              } else {
                params.set('sort', nextSort)
              }

              const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname

              startTransition(() => {
                router.replace(nextUrl, { scroll: false })
              })
            }}
            aria-label="Ordenar resultados"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tagSuggestions.length > 0 && deferredQuery.trim().startsWith('#') ? (
        <div className="search-tag-suggestions">
          {tagSuggestions.map(({ tag, count }) => (
            <Link key={tag} href={`/busca?q=%23${encodeURIComponent(tag)}`} className="tag search-tag-link">
              #{tag} · {count} {count === 1 ? 'artigo' : 'artigos'}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="search-results-header">
        <p className="placeholder-copy">
          {deferredQuery.trim()
            ? `${results.length} resultado${results.length === 1 ? '' : 's'} para "${deferredQuery.trim()}"`
            : 'Digite um termo para começar a buscar nos posts.'}
        </p>
        {isPending ? <span className="search-pending">Atualizando...</span> : null}
      </div>

      {deferredQuery.trim() ? (
        results.length > 0 ? (
          <div className="search-results-list">
            {results.map((result) => (
              <article key={result.slug} className="post-card search-result-card">
                <Link href={`/blog/${result.slug}`} className="card-link-overlay" aria-label={`Abrir post ${result.title}`} />
                {result.image ? (
                  <Image
                    src={result.image}
                    alt=""
                    width={200}
                    height={200}
                    className="search-result-card-thumb"
                  />
                ) : (
                  <div className="search-result-card-thumb search-result-card-thumb-placeholder" aria-hidden="true" />
                )}

                <div className="search-result-card-copy">
                  <div className="post-meta search-result-meta-row">
                    <span>{result.dateLabel}</span>
                    <span>{result.readingTime}</span>
                  </div>

                  <div className="search-result-card-heading">
                    <h2 className="search-result-card-title">{result.title}</h2>
                    <p>{result.description}</p>
                  </div>

                  <div className="post-card-footer search-result-card-footer">
                    <div className="tag-list">
                      {result.tags.map((tag) => (
                        <Link key={tag} href={`/busca?q=%23${encodeURIComponent(tag)}`} className="tag interactive-tag">
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-card search-empty-state">
            <h2>Nenhum resultado encontrado</h2>
            <p>
              Tente termos mais amplos, remova palavras muito específicas ou experimente combinações como
              &quot;machine learning&quot;, &quot;estatística&quot; ou &quot;analytics&quot;.
            </p>
          </div>
        )
      ) : null}
    </section>
  )
}
