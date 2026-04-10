import Link from 'next/link'

export function BackHomeButton() {
  return (
    <Link href="/" className="button button-secondary back-home-button">
      <span className="button-icon button-icon-home button-icon-dark" aria-hidden="true" />
      Voltar para a home
    </Link>
  )
}
