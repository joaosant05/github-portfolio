import { useEffect, useRef, useState } from "react";
import { sendContactMessage } from "../../utils/sendContactMessage";
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

  const [status, setStatus] = useState("idle");
  const pendingRequest = useRef(null);

  useEffect(() => () => pendingRequest.current?.abort(), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pendingRequest.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const fields = Object.fromEntries(
      ["name", "email", "subject", "message", "_honey"].map((key) => [key, String(formData.get(key) ?? "").trim()]),
    );
    if (![fields.name, fields.email, fields.subject, fields.message].every(Boolean)) {
      setStatus("invalid");
      return;
    }
    const controller = new AbortController();
    pendingRequest.current = controller;
    setStatus("sending");
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      await sendContactMessage(fields, controller.signal);
      setStatus("success");
      form.reset();
    } catch {
      setStatus(controller.signal.aborted ? "timeout" : "error");
    } finally {
      window.clearTimeout(timeout);
      pendingRequest.current = null;
    }
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
              aria-busy={status === "sending"}
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

              <label className="contact__honeypot" aria-hidden="true">
                Leave this field empty
                <input name="_honey" type="text" tabIndex={-1} autoComplete="off" />
              </label>

              <button className="contact__submit" type="submit" disabled={status === "sending"}>
                <span>{t(status === "sending" ? "contact.formSending" : "contact.formSubmitLabel")}</span>
                <FiSend aria-hidden="true" />
              </button>
              <p className={`contact__form-status is-${status}`} role="status" aria-live="polite">
                {status !== "idle" && status !== "sending" ? t(`contact.formStatus.${status}`) : ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
