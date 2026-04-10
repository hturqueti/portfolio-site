export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {year} Henrique Marques Turqueti. Todos os direitos reservados.</span>
        <div className="footer-links">
          <a href="mailto:contato@hmturqueti.com">Email</a>
          <a href="https://github.com/hturqueti">GitHub</a>
          <a href="https://www.linkedin.com">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
