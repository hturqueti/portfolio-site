import Image from 'next/image'
import Link from 'next/link'
import { getSearchDocuments } from '@/lib/posts'
import { HeaderSearch } from '@/components/HeaderSearch'

export function Header() {
  const documents = getSearchDocuments()

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <Image
            src="/images/branding/logo.svg"
            alt="Logo do site Henrique Turqueti"
            width={40}
            height={40}
            priority
          />
        </Link>

        <HeaderSearch documents={documents} />

        <nav className="nav" aria-label="Principal">
          <Link href="/">Início</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/projetos">Projetos</Link>
          <Link href="/sobre">Sobre mim</Link>
          <Link href="/contato">Contato</Link>
        </nav>
      </div>
    </header>
  )
}
