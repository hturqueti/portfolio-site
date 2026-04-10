import type { SearchDocument } from '@/lib/posts'

export type SearchSort =
  | 'relevance'
  | 'date_desc'
  | 'date_asc'
  | 'title_asc'
  | 'title_desc'

export type SearchResult = SearchDocument & {
  score: number
  matchedTerms: number
}

export type TagSuggestion = {
  tag: string
  count: number
}

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' })

function normalizeTerm(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value: string) {
  return Array.from(
    new Set(
      normalizeTerm(value)
        .split(/\s+/)
        .filter((term) => term.length > 1)
    )
  )
}

function isTagSearch(query: string) {
  return query.trim().startsWith('#')
}

function getCurrentTagFragment(query: string) {
  if (!isTagSearch(query)) {
    return ''
  }

  const hashIndex = query.lastIndexOf('#')

  if (hashIndex === -1) {
    return ''
  }

  return normalizeTerm(query.slice(hashIndex + 1))
}

function getSelectedTagTerms(query: string) {
  return Array.from(
    new Set(
      Array.from(query.matchAll(/#([^\s#]+)/g))
        .map((match) => normalizeTerm(match[1] ?? ''))
        .filter(Boolean)
    )
  )
}

function getSearchTerms(query: string) {
  if (isTagSearch(query)) {
    return tokenize(query.replaceAll('#', ' '))
  }

  return tokenize(query)
}

function byDateDesc(a: SearchDocument, b: SearchDocument) {
  return b.date.localeCompare(a.date)
}

function byDateAsc(a: SearchDocument, b: SearchDocument) {
  return a.date.localeCompare(b.date)
}

function byTitleAsc(a: SearchDocument, b: SearchDocument) {
  return collator.compare(a.title, b.title)
}

function byTitleDesc(a: SearchDocument, b: SearchDocument) {
  return collator.compare(b.title, a.title)
}

function compareResultsByRelevance(a: SearchResult, b: SearchResult) {
  if (b.score !== a.score) {
    return b.score - a.score
  }

  return byDateDesc(a, b) || byTitleAsc(a, b)
}

export function sortSearchResults(results: SearchResult[], sort: SearchSort) {
  const sorted = [...results]

  switch (sort) {
    case 'date_asc':
      return sorted.sort(byDateAsc)
    case 'date_desc':
      return sorted.sort(byDateDesc)
    case 'title_asc':
      return sorted.sort(byTitleAsc)
    case 'title_desc':
      return sorted.sort(byTitleDesc)
    case 'relevance':
    default:
      return sorted.sort(compareResultsByRelevance)
  }
}

export function searchPosts(documents: SearchDocument[], query: string) {
  const normalizedQuery = normalizeTerm(query)
  const terms = getSearchTerms(query)
  const tagSearch = isTagSearch(query)

  if (terms.length === 0) {
    if (tagSearch) {
      return []
    }

    return sortSearchResults(
      documents.map((document) => ({ ...document, score: 0, matchedTerms: 0 })),
      'date_desc'
    )
  }

  return documents
    .map((document) => {
      const title = normalizeTerm(document.title)
      const description = normalizeTerm(document.description)
      const tags = document.tags.map(normalizeTerm)
      const content = normalizeTerm(document.searchContent)
      const titleWords = new Set(title.split(/\s+/).filter(Boolean))
      const tagWords = new Set(tags.flatMap((tag) => tag.split(/\s+/).filter(Boolean)))

      let score = 0
      let matchedTerms = 0

      if (!tagSearch && normalizedQuery.length > 1 && title.includes(normalizedQuery)) {
        score += 28
      }

      if (!tagSearch && normalizedQuery.length > 1 && description.includes(normalizedQuery)) {
        score += 10
      }

      for (const term of terms) {
        let termScore = 0

        if (tagWords.has(term)) {
          termScore = Math.max(termScore, 16)
        } else if (tags.some((tag) => tag.includes(term))) {
          termScore = Math.max(termScore, 12)
        }

        if (!tagSearch) {
          if (titleWords.has(term)) {
            termScore = Math.max(termScore, 18)
          } else if (title.includes(term)) {
            termScore = Math.max(termScore, 12)
          }

          if (description.includes(term)) {
            termScore = Math.max(termScore, 9)
          }

          if (content.includes(term)) {
            termScore = Math.max(termScore, 5)
          }
        }

        if (termScore > 0) {
          matchedTerms += 1
          score += termScore
        }
      }

      if (matchedTerms === 0) {
        return null
      }

      score += Math.round((matchedTerms / terms.length) * 24)

      return {
        ...document,
        score,
        matchedTerms,
      }
    })
    .filter((result): result is SearchResult => result !== null)
}

export function getTopSearchResults(documents: SearchDocument[], query: string, limit = 5) {
  return sortSearchResults(searchPosts(documents, query), 'relevance').slice(0, limit)
}

export function getTagSuggestions(documents: SearchDocument[], query: string, limit = 5): TagSuggestion[] {
  if (!isTagSearch(query)) {
    return []
  }

  const partial = getCurrentTagFragment(query)
  const selectedTerms = getSelectedTagTerms(query)
  const selectedTermsExcludingCurrent = new Set(
    partial ? selectedTerms.filter((term) => term !== partial) : selectedTerms
  )

  return Array.from(new Set(documents.flatMap((document) => document.tags)))
    .map((tag) => {
      const normalizedTag = normalizeTerm(tag)
      const count = documents.filter((document) =>
        document.tags.some((documentTag) => normalizeTerm(documentTag) === normalizedTag)
      ).length

      return {
        tag,
        normalizedTag,
        count,
      }
    })
    .filter(({ normalizedTag }) => {
      if (selectedTermsExcludingCurrent.has(normalizedTag)) {
        return false
      }

      return partial ? normalizedTag.includes(partial) : true
    })
    .sort((a, b) => collator.compare(a.tag, b.tag))
    .slice(0, limit)
    .map(({ tag, count }) => ({ tag, count }))
}
