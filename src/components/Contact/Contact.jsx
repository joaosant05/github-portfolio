import {
  FiArrowUpRight,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { profileConfig } from "../../data/siteConfig";
import "./Contact.css";

function Contact() {
  const { t } = useTranslation();

  return (
    <section className="contact" id="contact">
      <div className="c-space">
        <div className="contact__shell">
          <div className="contact__intro">
            <span className="contact__eyebrow">{t("contact.eyebrow")}</span>

            <h2 className="contact__title">{t("contact.title")}</h2>

            <p className="contact__description">{t("contact.description")}</p>
          </div>

          <dl className="contact__details" aria-label={t("contact.cardsAriaLabel")}>
            <div className="contact__detail contact__detail--email">
              <dt>
                <FiMail aria-hidden="true" />
                <span>{t("contact.emailCardLabel")}</span>
              </dt>
              <dd>
                <a href={`mailto:${profileConfig.email}`}>
                  <span>{profileConfig.email}</span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              </dd>
            </div>

            <div className="contact__detail contact__detail--whatsapp">
              <dt>
                <FiMessageCircle aria-hidden="true" />
                <span>{t("contact.whatsappCardLabel")}</span>
              </dt>
              <dd>
                <a href={profileConfig.whatsappUrl} target="_blank" rel="noreferrer">
                  <span>{profileConfig.phoneDisplay}</span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default Contact;
