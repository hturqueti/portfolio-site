import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container section not-found">
      <p className="section-kicker">404</p>
      <h1>Página não encontrada</h1>
      <p>O caminho que você tentou acessar não existe nesta versão do site.</p>
      <Link href="/" className="button button-primary">
        Voltar para a home
      </Link>
    </section>
  )
}
