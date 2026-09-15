import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "motion/react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiChevronRight,
  FiGithub,
  FiLock,
  FiPlay,
} from "react-icons/fi";
import { portfolioProjects } from "../../data/portfolioData";
import { githubProjects } from "../../data/githubProjects";
import ProjectPreview from "./ProjectPreview";
import ProjectDetails from "./ProjectDetails";
import ProjectSiteLink from "./ProjectSiteLink";
import "./Portfolio.css";

function ProjectCard({ project, index, onOpen, previewsEnabled }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [previewActive, setPreviewActive] = useState(false);
  const timer = useRef(null);
  const title = t(project.titleKey);
  const stopPreview = useCallback(() => {
    clearTimeout(timer.current);
    setPreviewActive(false);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const startPreview = (event) => {
    if (event.pointerType !== "mouse" || reduceMotion || !previewsEnabled)
      return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPreviewActive(true), 240);
  };
  const openProject = () => {
    stopPreview();
    onOpen(project);
  };

  return (
    <article
      className="portfolio__card"
      style={{ "--project-accent": project.accent }}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
    >
      <button
        type="button"
        className="portfolio__cover-button"
        onClick={openProject}
        aria-label={t("work.readMoreProjectAria", { project: title })}
      >
        <img
          className="portfolio__cover"
          src={project.cover}
          alt={t("work.coverAria", { project: title })}
          width="1200"
          height="675"
          loading="lazy"
          decoding="async"
        />
        {previewActive && previewsEnabled ? (
          <ProjectPreview project={project} onStop={stopPreview} />
        ) : null}
        <span className="portfolio__preview-hint">
          <FiPlay aria-hidden="true" />
          {t("work.hoverPreview")}
        </span>
      </button>
      <div className="portfolio__card-body">
        <div className="portfolio__meta">
          <span>
            {String(index + 1).padStart(2, "0")} / {t(project.typeKey)}
          </span>
          <span>
            {project.isPrivate ? (
              <FiLock aria-hidden="true" />
            ) : (
              <span className="portfolio__status-dot" />
            )}
            {t(project.visibilityKey)}
          </span>
        </div>
        <h3>
          <button type="button" onClick={openProject}>
            {title}
          </button>
        </h3>
        <p className="portfolio__role">{t(project.roleKey)}</p>
        <p className="portfolio__description">{t(project.summaryKey)}</p>
        <div className="portfolio__tags">
          {project.cardTagKeys.map((key) => (
            <span key={key} className="portfolio__tag">
              {t(`work.projectTags.${key}`)}
            </span>
          ))}
        </div>
        <div className="portfolio__actions">
          <button type="button" onClick={openProject}>
            {t("work.exploreProject")}
            <FiChevronRight aria-hidden="true" />
          </button>
          {project.link ? (
            <ProjectSiteLink url={project.link} />
          ) : (
            <span>{t("work.privateAccess")}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const { t, i18n } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  const locale = i18n.resolvedLanguage?.startsWith("pt") ? "pt-BR" : "en";

  return (
    <section
      className="portfolio"
      id="portfolio"
      aria-labelledby="portfolio-title"
    >
      <div className="c-space">
        <div className="portfolio__shell">
          <header className="portfolio__heading">
            <div>
              <span className="portfolio__eyebrow">{t("work.eyebrow")}</span>
              <h2 id="portfolio-title">{t("work.title")}</h2>
            </div>
            <p>{t("work.description")}</p>
          </header>
          <div className="portfolio__grid">
            {portfolioProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={setSelectedProject}
                previewsEnabled={!selectedProject}
              />
            ))}
          </div>
          <footer className="portfolio__footer">
            <span>
              {t("work.selectedCount", { count: portfolioProjects.length })}
            </span>
            <button
              type="button"
              className="portfolio__show-more"
              aria-expanded={showMore}
              aria-controls="portfolio-more"
              onClick={() => setShowMore(!showMore)}
            >
              {t(showMore ? "work.showLess" : "work.showMore")}
              <FiArrowDown
                className={showMore ? "is-expanded" : ""}
                aria-hidden="true"
              />
            </button>
          </footer>
          <section
            id="portfolio-more"
            className="portfolio__repositories"
            hidden={!showMore}
            aria-labelledby="github-projects-title"
          >
            <header>
              <div>
                <span className="portfolio__eyebrow">GitHub</span>
                <h3 id="github-projects-title">{t("work.githubTitle")}</h3>
              </div>
              <a
                href="https://github.com/joaosant05"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("work.githubProfile")}
                <FiArrowUpRight aria-hidden="true" />
              </a>
            </header>
            <div className="portfolio__repo-list">
              {githubProjects.map((repo) => (
                <a
                  className="portfolio__repo"
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiGithub
                    className="portfolio__repo-icon"
                    aria-hidden="true"
                  />
                  <div>
                    <h4>{repo.name}</h4>
                    <p>{repo.descriptions?.[locale] || repo.description}</p>
                  </div>
                  <span className="portfolio__repo-language">
                    {repo.language}
                  </span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      {selectedProject ? (
        <ProjectDetails
          key={selectedProject.id}
          project={selectedProject}
          onClose={closeProject}
        />
      ) : null}
    </section>
  );
}
