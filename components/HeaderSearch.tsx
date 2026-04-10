'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { FormEvent, KeyboardEvent } from 'react'
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import type { SearchDocument } from '@/lib/posts'
import { getTagSuggestions, searchPosts, sortSearchResults } from '@/lib/search'

type HeaderSearchProps = {
  documents: SearchDocument[]
}

function buildSearchUrl(query: string) {
  const params = new URLSearchParams()
  const trimmedQuery = query.trim()

  if (trimmedQuery) {
    params.set('q', trimmedQuery)
  }

  const search = params.toString()
  return search ? `/busca?${search}` : '/busca'
}

export function HeaderSearch({ documents }: HeaderSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeTagIndex, setActiveTagIndex] = useState(-1)
  const [, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const trimmedQuery = deferredQuery.trim()

    if (!trimmedQuery) {
      return []
    }

    return sortSearchResults(searchPosts(documents, trimmedQuery), 'relevance')
  }, [documents, deferredQuery])

  const tagSuggestions = useMemo(() => getTagSuggestions(documents, deferredQuery), [documents, deferredQuery])

  const visibleResults = results.slice(0, 5)
  const hasMoreResults = results.length > visibleResults.length
  const showTagSuggestions = tagSuggestions.length > 0 && deferredQuery.trim().startsWith('#')

  useEffect(() => {
    if (!showTagSuggestions) {
      setActiveTagIndex(-1)
      return
    }

    setActiveTagIndex((currentIndex) => {
      if (currentIndex >= 0 && currentIndex < tagSuggestions.length) {
        return currentIndex
      }

      return 0
    })
  }, [showTagSuggestions, tagSuggestions.length])

  useEffect(() => {
    setIsOpen(false)
    setActiveTagIndex(-1)

    if (pathname === '/busca') {
      setQuery('')
    }
  }, [pathname])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return
    }

    startTransition(() => {
      router.push(buildSearchUrl(trimmedQuery))
    })

    setQuery('')
    setIsOpen(false)
    setActiveTagIndex(-1)
  }

  function applySelectedTag(tag: string) {
    const hashIndex = query.lastIndexOf('#')
    const prefix = hashIndex >= 0 ? query.slice(0, hashIndex) : ''
    const suffixSource = hashIndex >= 0 ? query.slice(hashIndex + 1) : query
    const suffix = suffixSource.includes(' ') ? suffixSource.slice(suffixSource.indexOf(' ')) : ''
    const nextQuery = `${prefix}#${tag}${suffix || ' '}`

    setQuery(nextQuery)
    setIsOpen(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showTagSuggestions) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveTagIndex((currentIndex) => (currentIndex + 1) % tagSuggestions.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveTagIndex((currentIndex) => (currentIndex <= 0 ? tagSuggestions.length - 1 : currentIndex - 1))
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const selectedTag = tagSuggestions[activeTagIndex]?.tag ?? tagSuggestions[0]?.tag

      if (selectedTag) {
        applySelectedTag(selectedTag)
      }
    }
  }

  return (
    <div className="header-search" ref={containerRef}>
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <div className="search-input-wrap">
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setIsOpen(true)
            }}
            onFocus={() => {
              if (query.trim()) {
                setIsOpen(true)
              }
            }}
            onKeyDown={handleKeyDown}
            className="search-input"
            placeholder="Buscar posts por título, tag ou conteúdo"
            aria-label="Buscar posts"
          />
          <button type="submit" className="search-input-icon-button" aria-label="Buscar">
            <Image
              src="/images/icons/search.svg"
              alt=""
              width={18}
              height={18}
              className="search-input-icon-image"
            />
          </button>
        </div>
      </form>

      {isOpen && query.trim() ? (
        <div className="search-dropdown">
          {showTagSuggestions ? (
            <>
              <div className="search-dropdown-list">
                {tagSuggestions.map(({ tag, count }, index) => (
                  <Link
                    key={tag}
                    href={buildSearchUrl(`#${tag}`)}
                    className={`search-result-link${activeTagIndex === index ? ' search-result-link-active' : ''}`}
                    onClick={() => {
                      setQuery('')
                      setIsOpen(false)
                    }}
                  >
                    <span className="search-result-title">#{tag}</span>
                    <span className="search-result-meta">
                      Buscar {count} {count === 1 ? 'artigo' : 'artigos'} com essa tag
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : visibleResults.length > 0 ? (
            <>
              <div className="search-dropdown-list">
                {visibleResults.map((result) => (
                  <Link
                    key={result.slug}
                    href={`/blog/${result.slug}`}
                    className="search-result-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="search-result-title">{result.title}</span>
                    <span className="search-result-meta">
                      {result.dateLabel}
                      {result.tags.length > 0 ? ` · ${result.tags.join(', ')}` : ''}
                    </span>
                  </Link>
                ))}
              </div>

              {hasMoreResults ? (
                <Link
                  href={buildSearchUrl(query)}
                  className="search-show-more"
                  onClick={() => {
                    setQuery('')
                    setIsOpen(false)
                  }}
                >
                  Mostrar mais
                </Link>
              ) : null}
            </>
          ) : (
            <div className="search-empty">Nenhum post encontrado para esse termo.</div>
          )}
        </div>
      ) : null}
    </div>
  )
}
