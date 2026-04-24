import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="c-space footer__container">
        <div className="footer__content">
          <h3 className="footer__brand">Lorem Ipsum</h3>
          <p className="footer__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <nav className="footer__links" aria-label="Links do rodapé">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:email@email.com">Email</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;