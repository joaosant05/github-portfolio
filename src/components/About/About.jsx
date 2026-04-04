import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGithubLastYearCommits } from "../../services/github";
import { getLeetCodeStats } from "../../services/leetcode";
import "./About.css";

const PROFILE_USERNAMES = {
  linkedin: "seuusuario",
  github: "seuusuario",
  instagram: "seuusuario",
  leetcode: "seuusuario",
};

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
    label: "LinkedIn",
    href: `https://linkedin.com/in/${PROFILE_USERNAMES.linkedin}`,
    icon: "/assets/logos/social/LinkedIn_icon.png",
  },
  {
    key: "github",
    label: "GitHub",
    href: `https://github.com/${PROFILE_USERNAMES.github}`,
    icon: "/assets/logos/social/github_licon.webp",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: `https://instagram.com/${PROFILE_USERNAMES.instagram}`,
    icon: "/assets/logos/social/Instagram_icon.png",
  },
  {
    key: "leetcode",
    label: "LeetCode",
    href: `https://leetcode.com/${PROFILE_USERNAMES.leetcode}`,
    icon: "/assets/logos/social/leetcode-icon.png",
  },
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "--";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function StackCrawl({ ariaLabel, title }) {
  return (
    <div className="about__crawl-scene" aria-label={ariaLabel}>
      <div className="about__crawl-header">
        <span className="about__eyebrow">{title}</span>
      </div>

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

function MetricCarousel({ slides, currentIndex, onPrev, onNext, title }) {
  return (
    <div className="about__metrics-card" aria-label={title}>
      <div className="about__metrics-toolbar">
        <button
          type="button"
          className="about__metrics-arrow"
          onClick={onPrev}
          aria-label="Mostrar plataforma anterior"
        >
          ←
        </button>

        <div className="about__metrics-dots" aria-hidden="true">
          {slides.map((slide, index) => (
            <span
              key={slide.key}
              className={`about__metrics-dot ${
                index === currentIndex ? "about__metrics-dot--active" : ""
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          className="about__metrics-arrow"
          onClick={onNext}
          aria-label="Mostrar próxima plataforma"
        >
          →
        </button>
      </div>

      <div className="about__metrics-viewport">
        <div
          className="about__metrics-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <article
              key={slide.key}
              className={`about__metrics-slide ${slide.toneClass}`}
            >
              <header className="about__metrics-slide-head">
                <div>
                  <span className="about__metrics-platform">{slide.platform}</span>
                  <h4>{slide.title}</h4>
                </div>

                <span className="about__metrics-highlight">
                  {slide.highlight}
                </span>
              </header>

              <div className="about__metrics-body">
                {slide.type === "github" ? (
                  <div className="about__metrics-main">
                    <div className="about__metrics-main-value">
                      {slide.mainValue}
                    </div>
                    <p className="about__metrics-main-label">{slide.mainLabel}</p>

                    <div className="about__metrics-meta">
                      <span>@{slide.username}</span>
                      <span>Atualizado em {slide.updatedAt}</span>
                    </div>
                  </div>
                ) : (
                  <div className="about__difficulty-grid">
                    {slide.items.map((item) => (
                      <div
                        key={item.label}
                        className={`about__difficulty-item ${item.toneClass}`}
                      >
                        <span className="about__difficulty-label">
                          {item.label}
                        </span>
                        <strong className="about__difficulty-value">
                          {item.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function About() {
  const { t } = useTranslation();
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const [statsState, setStatsState] = useState({
    loading: true,
    error: false,
    github: null,
    leetcode: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setStatsState({
        loading: true,
        error: false,
        github: null,
        leetcode: null,
      });

      try {
        const [github, leetcode] = await Promise.all([
          getGithubLastYearCommits(),
          getLeetCodeStats(),
        ]);

        if (!isMounted) return;

        setStatsState({
          loading: false,
          error: false,
          github,
          leetcode,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);

        if (!isMounted) return;

        setStatsState({
          loading: false,
          error: true,
          github: null,
          leetcode: null,
        });
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    if (statsState.loading) {
      return [
        {
          key: "github",
          type: "github",
          platform: "GitHub",
          title: "Commits",
          highlight: "Loading",
          mainValue: "...",
          mainLabel: "Últimos 12 meses",
          username: PROFILE_USERNAMES.github,
          updatedAt: "--",
          toneClass: "about__metrics-slide--github",
        },
        {
          key: "leetcode",
          type: "leetcode",
          platform: "LeetCode",
          title: "Solved by difficulty",
          highlight: "Loading",
          items: [
            {
              label: "Easy",
              value: "...",
              toneClass: "about__difficulty-item--easy",
            },
            {
              label: "Medium",
              value: "...",
              toneClass: "about__difficulty-item--medium",
            },
            {
              label: "Hard",
              value: "...",
              toneClass: "about__difficulty-item--hard",
            },
            {
              label: "Total",
              value: "...",
              toneClass: "about__difficulty-item--total",
            },
          ],
          toneClass: "about__metrics-slide--leetcode",
        },
      ];
    }

    if (statsState.error || !statsState.github || !statsState.leetcode) {
      return [
        {
          key: "github",
          type: "github",
          platform: "GitHub",
          title: "Commits",
          highlight: "Error",
          mainValue: "--",
          mainLabel: "Verifique usernames/workflow",
          username: PROFILE_USERNAMES.github,
          updatedAt: "--",
          toneClass: "about__metrics-slide--github",
        },
        {
          key: "leetcode",
          type: "leetcode",
          platform: "LeetCode",
          title: "Solved by difficulty",
          highlight: "Error",
          items: [
            {
              label: "Easy",
              value: "--",
              toneClass: "about__difficulty-item--easy",
            },
            {
              label: "Medium",
              value: "--",
              toneClass: "about__difficulty-item--medium",
            },
            {
              label: "Hard",
              value: "--",
              toneClass: "about__difficulty-item--hard",
            },
            {
              label: "Total",
              value: "--",
              toneClass: "about__difficulty-item--total",
            },
          ],
          toneClass: "about__metrics-slide--leetcode",
        },
      ];
    }

    return [
      {
        key: "github",
        type: "github",
        platform: "GitHub",
        title: "Commits",
        highlight: "12 months",
        mainValue: formatNumber(statsState.github.totalCommits),
        mainLabel: "Total de commits nos últimos 12 meses",
        username: statsState.github.username,
        updatedAt: formatDate(statsState.github.updatedAt),
        toneClass: "about__metrics-slide--github",
      },
      {
        key: "leetcode",
        type: "leetcode",
        platform: "LeetCode",
        title: "Solved by difficulty",
        highlight: formatNumber(statsState.leetcode.totalSolved),
        items: [
          {
            label: "Easy",
            value: formatNumber(statsState.leetcode.easySolved),
            toneClass: "about__difficulty-item--easy",
          },
          {
            label: "Medium",
            value: formatNumber(statsState.leetcode.mediumSolved),
            toneClass: "about__difficulty-item--medium",
          },
          {
            label: "Hard",
            value: formatNumber(statsState.leetcode.hardSolved),
            toneClass: "about__difficulty-item--hard",
          },
          {
            label: "Total",
            value: formatNumber(statsState.leetcode.totalSolved),
            toneClass: "about__difficulty-item--total",
          },
        ],
        toneClass: "about__metrics-slide--leetcode",
      },
    ];
  }, [statsState]);

  const handlePrevMetric = () => {
    setCurrentMetricIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextMetric = () => {
    setCurrentMetricIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="about" id="about">
      <div className="c-space">
        <div className="about__layout">
          <article className="about__card about__card--bio grid-default-color">
            <div className="about__image-wrap">
              <img
                src="/assets/socials/foto.jpeg"
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

          <article className="about__card about__card--numbers grid-default-color">
            <div className="about__numbers-head">
              <span className="about__eyebrow">
                {t("about.numbersTitle", { defaultValue: "Numbers" })}
              </span>
              <p className="subtext about__numbers-subtext">
                {t("about.numbersDescription", {
                  defaultValue: "GitHub and LeetCode stats.",
                })}
              </p>
            </div>

            <MetricCarousel
              slides={slides}
              currentIndex={currentMetricIndex}
              onPrev={handlePrevMetric}
              onNext={handleNextMetric}
              title={t("about.numbersAriaLabel", {
                defaultValue: "Developer statistics",
              })}
            />
          </article>

          <article className="about__card about__card--stack">
            <StackCrawl
              ariaLabel={t("about.stackAriaLabel")}
              title={t("about.stackTitle")}
            />
          </article>

          <div
            className="about__socials"
            aria-label={t("about.socialsAriaLabel")}
          >
            {socialItems.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="about__social"
                aria-label={social.label}
                title={social.label}
              >
                <img
                  src={social.icon}
                  alt=""
                  className="about__social-badge"
                  loading="lazy"
                />
                <span className="about__sr-only">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;