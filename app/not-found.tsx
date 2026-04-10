import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container section not-found">
      <h1>
        Página <span className="gradient-text">não encontrada</span>
      </h1>
      <p>O caminho que você tentou acessar não existe nesta versão do site.</p>
      <Link href="/" className="button button-primary">
        <span className="button-icon button-icon-home" aria-hidden="true" />
        Voltar para a home
      </Link>
    </section>
  )
}
