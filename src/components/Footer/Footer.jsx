import { useTranslation } from "react-i18next";
import "./Footer.css";

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="c-space footer__container">
        <p className="footer__copy">{t("footer.rights", { year })}</p>
      </div>
    </footer>
  );
}

export default Footer;
