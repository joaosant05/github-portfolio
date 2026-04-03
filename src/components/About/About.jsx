import React from "react";
import { useTranslation } from "react-i18next";
import "./About.css";

const stackItems = [
  { label: "React", icon: "/assets/logos/stacks/react.svg" },
  { label: "JavaScript", icon: "/assets/logos/stacks/javascript.svg" },
  { label: "HTML5", icon: "/assets/logos/stacks/html-5.svg" },
  { label: "CSS3", icon: "/assets/logos/stacks/css.svg" },

  { label: "Python", icon: "/assets/logos/stacks/python.svg" },
  { label: "FastAPI", icon: "/assets/logos/stacks/fastapi-icon.svg" },
  { label: "Java", icon: "/assets/logos/stacks/java.svg" },
  { label: "C++", icon: "/assets/logos/stacks/c-plusplus.svg" },

  { label: "PostgreSQL", icon: "/assets/logos/stacks/postgresql.svg" },
  { label: "MySQL", icon: "/assets/logos/stacks/mysql-icon.svg" },

  { label: "Docker", icon: "/assets/logos/stacks/docker-icon.svg" },
  { label: "Azure DevOps", icon: "/assets/logos/stacks/azure-devops.svg" },
  { label: "DigitalOcean", icon: "/assets/logos/stacks/digital-ocean-icon.svg" },

  { label: "Git", icon: "/assets/logos/stacks/git-icon.svg" },
  { label: "Figma", icon: "/assets/logos/stacks/figma.svg" },
  {
    label: "Illustrator",
    icon: "/assets/logos/stacks/adobe-illustrator.svg",
  },
];

const socialItems = [
  {
    key: "linkedin",
    href: "https://linkedin.com/in/seuusuario",
    badge: "in",
  },
  {
    key: "github",
    href: "https://github.com/seuusuario",
    badge: "GH",
  },
  {
    key: "instagram",
    href: "https://instagram.com/seuusuario",
    badge: "IG",
  },
  {
    key: "email",
    href: "mailto:seuemail@dominio.com",
    badge: "@",
  },
  {
    key: "behance",
    href: "https://behance.net/seuusuario",
    badge: "Be",
  },
];

function StackCrawl({ ariaLabel }) {
  return (
    <div className="about__crawl-scene" aria-label={ariaLabel}>
      <div className="about__crawl-overlay about__crawl-overlay--top" />
      <div className="about__crawl-overlay about__crawl-overlay--bottom" />

      <div className="about__crawl-viewport">
        <div className="about__crawl-plane">
          <div className="about__crawl-sequence">
            {stackItems.map((item) => (
              <div key={item.label} className="about__crawl-line">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="about__crawl-icon"
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  const { t } = useTranslation();

  const socials = socialItems.map((item) => ({
    ...item,
    label: t(`about.socials.${item.key}.label`),
    description: t(`about.socials.${item.key}.description`),
  }));

  return (
    <section className="about" id="about">
      <div className="c-space">
        <div className="about__layout">
          <article className="about__card about__card--bio grid-default-color">
            <div className="about__image-wrap">
              <img
                src="/assets/sociais/foto.jpg"
                alt={t("about.photoAlt")}
                className="about__image"
              />
            </div>

            <div className="about__card-content">
              <span className="about__eyebrow">{t("about.eyebrow")}</span>
              <h3>{t("about.name")}</h3>

              <p className="subtext">{t("about.paragraph1")}</p>
              <p className="subtext">{t("about.paragraph2")}</p>
            </div>
          </article>

          <article className="about__card about__card--stack grid-black-color">
            <div className="about__stack-copy">
              <span className="about__eyebrow">{t("about.stackTitle")}</span>
            </div>

            <StackCrawl ariaLabel={t("about.stackAriaLabel")} />
          </article>

          <div
            className="about__socials"
            aria-label={t("about.socialsAriaLabel")}
          >
            {socials.map((social) => {
              const isExternal = !social.href.startsWith("mailto:");

              return (
                <a
                  key={social.key}
                  href={social.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="about__social grid-default-color"
                  aria-label={social.label}
                  title={social.label}
                >
                  <span className="about__social-badge">{social.badge}</span>

                  <span className="about__social-text">
                    <strong className="about__social-label">
                      {social.label}
                    </strong>
                    <small className="about__social-description">
                      {social.description}
                    </small>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;