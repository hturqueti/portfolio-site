import Image from 'next/image'
import { getSearchDocuments } from '@/lib/posts'
import { HeaderSearch } from '@/components/HeaderSearch'
import { ScrollTopLink } from '@/components/ScrollTopLink'

export function Header() {
  const documents = getSearchDocuments()

  return (
    <header className="site-header">
      <div className="container header-inner">
        <ScrollTopLink href="/" className="brand">
          <Image
            src="/images/branding/logo.svg"
            alt="Logo do site Henrique Turqueti"
            width={40}
            height={40}
            priority
          />
        </ScrollTopLink>

        <HeaderSearch documents={documents} />

        <nav className="nav" aria-label="Principal">
          <ScrollTopLink href="/">Início</ScrollTopLink>
          <ScrollTopLink href="/blog">Blog</ScrollTopLink>
          <ScrollTopLink href="/projetos">Projetos</ScrollTopLink>
          <ScrollTopLink href="/sobre">Sobre mim</ScrollTopLink>
          <ScrollTopLink href="/contato">Contato</ScrollTopLink>
        </nav>
      </div>
    </header>
  )
}
