import Link from 'next/link'

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          Henrique <span className="brand-accent">Turqueti</span>
        </Link>

        <nav className="nav" aria-label="Principal">
          <Link href="/">Início</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/sobre">Sobre mim</Link>
          <a href="https://github.com/hturqueti">GitHub</a>
          <a href="https://www.linkedin.com">LinkedIn</a>
        </nav>
      </div>
    </header>
  )
}
