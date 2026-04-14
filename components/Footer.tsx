import Image from 'next/image'
import { SmartLink } from '@/components/SmartLink'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {year} Henrique Marques Turqueti. Todos os direitos reservados.</span>
        <div className="footer-links">
          <SmartLink href="mailto:contato@hmturqueti.com" aria-label="Email">
            <Image src="/images/icons/mail.svg" alt="" width={20} height={20} className="footer-icon" />
          </SmartLink>
          <SmartLink href="https://github.com/hturqueti" aria-label="GitHub">
            <Image src="/images/icons/github.svg" alt="" width={20} height={20} className="footer-icon" />
          </SmartLink>
          <SmartLink href="https://www.linkedin.com/in/hturqueti/" aria-label="LinkedIn">
            <Image src="/images/icons/linkedin.svg" alt="" width={20} height={20} className="footer-icon" />
          </SmartLink>
        </div>
      </div>
    </footer>
  )
}
