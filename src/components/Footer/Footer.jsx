import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="c-space footer__container">
        <div>
          <h3 className="footer__brand">Lorem Ipsum</h3>
          <p className="footer__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="footer__links">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:email@email.com">Email</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;