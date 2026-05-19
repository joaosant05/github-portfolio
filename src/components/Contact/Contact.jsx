import {
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { profileConfig } from "../../data/siteConfig";
import "./Contact.css";

function Contact() {
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const subject = formData.get("subject")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    const body = [
      `${t("contact.formNameLabel")}: ${name}`,
      `${t("contact.formEmailLabel")}: ${email}`,
      `${t("contact.formSubjectLabel")}: ${subject}`,
      "",
      `${t("contact.formMessageLabel")}:`,
      message,
    ].join("\n");

    const mailtoSubject = subject
      ? `${t("contact.formMailSubjectPrefix")} ${subject}`
      : t("contact.formMailSubjectFallback");

    window.location.href = `mailto:${profileConfig.email}?subject=${encodeURIComponent(
      mailtoSubject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact" id="contact">
      <div className="c-space">
        <div className="contact__shell">
          <div className="contact__intro">
            <span className="contact__eyebrow">{t("contact.eyebrow")}</span>

            <h2 className="contact__title">{t("contact.title")}</h2>

            <p className="contact__description">{t("contact.description")}</p>

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

              <div className="contact__detail">
                <dt>
                  <FiMapPin aria-hidden="true" />
                  <span>{t("contact.locationCardLabel")}</span>
                </dt>
                <dd>
                  <span>{t("contact.locationValue")}</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="contact__content">
            <form
              className="contact__form"
              aria-label={t("contact.formAriaLabel")}
              onSubmit={handleSubmit}
            >
              <h3 className="contact__form-title">{t("contact.formTitle")}</h3>

              <label className="contact__field">
                <span>{t("contact.formNameLabel")}</span>
                <input
                  name="name"
                  type="text"
                  placeholder={t("contact.formNamePlaceholder")}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="contact__field">
                <span>{t("contact.formEmailLabel")}</span>
                <input
                  name="email"
                  type="email"
                  placeholder={t("contact.formEmailPlaceholder")}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="contact__field">
                <span>{t("contact.formSubjectLabel")}</span>
                <input
                  name="subject"
                  type="text"
                  placeholder={t("contact.formSubjectPlaceholder")}
                  required
                />
              </label>

              <label className="contact__field">
                <span>{t("contact.formMessageLabel")}</span>
                <textarea
                  name="message"
                  placeholder={t("contact.formMessagePlaceholder")}
                  rows="5"
                  required
                />
              </label>

              <button className="contact__submit" type="submit">
                <span>{t("contact.formSubmitLabel")}</span>
                <FiSend aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
