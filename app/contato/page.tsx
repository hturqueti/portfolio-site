import type { Metadata } from 'next'
import Image from 'next/image'

const contactMethods = [
  {
    title: 'E-mail',
    description: 'Melhor canal para propostas, convites, dúvidas mais detalhadas e conversas que pedem contexto.',
    href: 'mailto:contato@hmturqueti.com',
    value: 'contato@hmturqueti.com',
    cta: 'Enviar e-mail',
    iconSrc: '/images/icons/mail.svg',
  },
  {
    title: 'GitHub',
    description: 'Para ver projetos, repositórios públicos, histórico técnico e formas práticas de acompanhar meu trabalho.',
    href: 'https://github.com/hturqueti',
    value: 'github.com/hturqueti',
    cta: 'Abrir GitHub',
    iconSrc: '/images/icons/github.svg',
  },
  {
    title: 'LinkedIn',
    description: 'Canal mais direto para networking, oportunidades profissionais e contato rápido sobre carreira e colaboração.',
    href: 'https://www.linkedin.com',
    value: 'linkedin.com',
    cta: 'Abrir LinkedIn',
    iconSrc: '/images/icons/linkedin.svg',
  },
] as const

export const metadata: Metadata = {
  title: 'Contato | Henrique Marques Turqueti',
  description: 'Entre em contato por e-mail, GitHub ou LinkedIn.',
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="container section contact-hero">
        <div className="contact-hero-copy">
          <span className="eyebrow">Contato</span>
          <h1>
            Vamos conversar sobre <span className="gradient-text">dados, projetos e IA</span>?
          </h1>
          <p className="section-copy">
            Se você quer discutir uma oportunidade, trocar uma ideia técnica ou entrar em contato sobre algum projeto, estes são os canais principais. Escolha o formato que fizer mais sentido para a conversa.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="contact-grid">
          {contactMethods.map(({ title, description, href, value, iconSrc }) => (
            <a key={title} href={href} className="contact-card">
              <div className="interest-header">
                <span className="interest-icon">
                  <Image
                    src={iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                    className="interest-icon-image"
                  />
                </span>
                <div>
                  <h2>{title}</h2>
                </div>
              </div>

              <p>{description}</p>
              <span className="contact-value">{value}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
