import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import achievementsData from "../../data/achivements";
import "./About.css";

const AUTO_ROTATE_DELAY = 50000;

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

function getDateLocale(language) {
  if (!language) return "en-US";

  const normalized = language.toLowerCase();

  if (normalized.includes("pt")) return "pt-BR";
  return "en-US";
}

function formatDate(value, language) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(getDateLocale(language), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function resolveAchievementImage(imageValue) {
  if (!imageValue) return "/assets/achivements/default-badge.webp";

  if (
    imageValue.startsWith("/") ||
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

  return `/assets/achivements/${imageValue}`;
}

function About() {
  const { t, i18n } = useTranslation();
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const achievements = useMemo(() => {
    const list = Array.isArray(achievementsData) ? achievementsData : [];

    return [...list]
      .map((achievement, index) => ({
        id: achievement.id || `achievement-${index + 1}`,
        title: achievement.title || achievement.name || "Conquista sem título",
        issuer:
          achievement.issuer ||
          achievement.organization ||
          achievement.company ||
          "Emissor não informado",
        issuedAt:
          achievement.issuedAt ||
          achievement.issued ||
          achievement.date ||
          achievement.issuedDate ||
          "",
        description:
          achievement.description ||
          achievement.summary ||
          achievement.text ||
          "",
        badgeImage: resolveAchievementImage(
          achievement.badgeImage ||
            achievement.image ||
            achievement.logo ||
            achievement.icon ||
            achievement.badge ||
            ""
        ),
        credentialUrl:
          achievement.credentialUrl ||
          achievement.url ||
          achievement.link ||
          achievement.credlyUrl ||
          "",
      }))
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  }, []);

  const featuredAchievements = useMemo(
    () => achievements.slice(0, 4),
    [achievements]
  );

  const carouselItems = useMemo(
    () => [
      {
        id: "bio",
        label: t("about.eyebrow", { defaultValue: "About me" }),
      },
      {
        id: "stack",
        label: t("about.stackTitle", { defaultValue: "Tech Stack" }),
      },
      {
        id: "achievements",
        label: t("about.achievementsTitle", {
          defaultValue: "Achievements",
        }),
      },
    ],
    [t]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);

      return () => {
        mediaQuery.removeEventListener("change", updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.intersectionRatio >= 0.3);
      },
      {
        threshold: [0, 0.15, 0.3, 0.45, 0.6],
        rootMargin: "-6% 0px -6% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || prefersReducedMotion || carouselItems.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActivePanel((prev) => (prev + 1) % carouselItems.length);
    }, AUTO_ROTATE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [carouselItems.length, isInView, prefersReducedMotion]);

  const handlePanelChange = (index) => {
    setActivePanel(index);
  };

  return (
    <section className="about" id="about">
      <div className="c-space">
        <div className="about__shell">
          <div
            ref={carouselRef}
            className={`about__carousel about__reveal ${
              isInView ? "is-visible" : ""
            }`}
            aria-roledescription="carousel"
            aria-label={t("about.carouselAriaLabel", {
              defaultValue: "About section carousel",
            })}
          >
            <div className="about__carousel-viewport">
              <div className="about__carousel-stage">
                <article
                  id="about-panel-bio"
                  className={`about__panel about__carousel-panel ${
                    activePanel === 0 ? "is-active" : ""
                  }`}
                  aria-hidden={activePanel !== 0}
                >
                  <div className="about__panel-head">
                    <span className="about__eyebrow">
                      {t("about.eyebrow", { defaultValue: "About me" })}
                    </span>
                  </div>

                  <div className="about__bio-grid">
                    <div className="about__image-wrap">
                      <img
                        src="/assets/socials/foto.jpeg"
                        alt={t("about.photoAlt")}
                        className="about__image"
                      />
                    </div>

                    <div className="about__copy">
                      <h3>{t("about.name")}</h3>
                      <p>{t("about.paragraph1")}</p>
                      <p>{t("about.paragraph2")}</p>
                    </div>
                  </div>
                </article>

                <article
                  id="about-panel-stack"
                  className={`about__panel about__carousel-panel ${
                    activePanel === 1 ? "is-active" : ""
                  }`}
                  aria-hidden={activePanel !== 1}
                >
                  <div className="about__panel-head">
                    <span className="about__eyebrow">
                      {t("about.stackTitle", { defaultValue: "Tech Stack" })}
                    </span>

                    <p className="about__intro">
                      {t("about.stackDescription", {
                        defaultValue:
                          "Technologies and tools I have worked with throughout my projects.",
                      })}
                    </p>
                  </div>

                  <div
                    className="about__stack-grid"
                    aria-label={t("about.stackAriaLabel")}
                  >
                    {stackItems.map((item) => (
                      <div key={item.label} className="about__stack-item">
                        <img src={item.icon} alt={item.label} loading="lazy" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article
                  id="about-panel-achievements"
                  className={`about__panel about__carousel-panel ${
                    activePanel === 2 ? "is-active" : ""
                  }`}
                  aria-hidden={activePanel !== 2}
                >
                  <div className="about__panel-head">
                    <span className="about__eyebrow">
                      {t("about.achievementsTitle", {
                        defaultValue: "Achievements",
                      })}
                    </span>

                    <p className="about__intro">
                      {t("about.achievementsDescription", {
                        defaultValue:
                          "Certifications, badges, and achievements that are part of my journey.",
                      })}
                    </p>
                  </div>

                  {featuredAchievements.length ? (
                    <div className="about__achievements-grid">
                      {featuredAchievements.map((achievement, index) => (
                        <article
                          key={achievement.id}
                          className="about__achievement"
                        >
                          <div className="about__achievement-media">
                            <img
                              src={achievement.badgeImage}
                              alt={achievement.title}
                              loading="lazy"
                            />
                          </div>

                          <div className="about__achievement-content">
                            <div className="about__achievement-meta">
                              <span className="about__achievement-index">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="about__achievement-date">
                                {formatDate(achievement.issuedAt, i18n.language)}
                              </span>
                            </div>

                            <h4>{achievement.title}</h4>

                            <p className="about__achievement-issuer">
                              {achievement.issuer}
                            </p>

                            {achievement.description ? (
                              <p className="about__achievement-description">
                                {achievement.description}
                              </p>
                            ) : null}

                            {achievement.credentialUrl ? (
                              <a
                                href={achievement.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="about__achievement-link"
                              >
                                {t("about.viewCredential", {
                                  defaultValue: "View credential",
                                })}
                              </a>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="about__empty">
                      {t("about.achievementsEmpty", {
                        defaultValue:
                          "Add achievements to src/data/achivements.js",
                      })}
                    </div>
                  )}
                </article>
              </div>
            </div>

            <div
              className="about__carousel-guides"
              aria-label={t("about.carouselDotsAriaLabel", {
                defaultValue: "About section panels navigation",
              })}
            >
              {carouselItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-controls={`about-panel-${item.id}`}
                  aria-pressed={activePanel === index}
                  className={`about__carousel-dot ${
                    activePanel === index ? "is-active" : ""
                  }`}
                  onClick={() => handlePanelChange(index)}
                >
                  <span className="about__sr-only">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;