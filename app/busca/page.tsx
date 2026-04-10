import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchPageClient } from '@/components/SearchPageClient'
import { getSearchDocuments } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Busca | Henrique Marques Turqueti',
  description: 'Busque posts por título, tags e conteúdo.',
}

export default function SearchPage() {
  const documents = getSearchDocuments()

  return (
    <Suspense>
      <SearchPageClient documents={documents} />
    </Suspense>
  )
}
