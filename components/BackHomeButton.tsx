import { ScrollTopLink } from '@/components/ScrollTopLink'

export function BackHomeButton() {
  return (
    <ScrollTopLink href="/" className="button button-secondary back-home-button">
      <span className="button-icon button-icon-home button-icon-dark" aria-hidden="true" />
      Voltar para a home
    </ScrollTopLink>
  )
}
