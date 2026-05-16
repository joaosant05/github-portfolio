import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { FiArrowUpRight, FiExternalLink, FiX } from "react-icons/fi";
import { portfolioProjects } from "../../data/portfolioData";
import "./Portfolio.css";

const revealViewport = {
  once: false,
  amount: 0.18,
  margin: "0px 0px -8% 0px",
};

const headingRevealVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.985,
    filter: "blur(12px)",
    transition: {
      duration: 0.42,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const projectRevealVariants = {
  hidden: {
    opacity: 0,
    y: 42,
    scale: 0.982,
    filter: "blur(14px)",
    transition: {
      duration: 0.42,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.68,
      delay: Math.min(index * 0.055, 0.28),
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function getProjectImages(project) {
  const images =
    project.images ||
    project.galleryImages ||
    project.screenshots ||
    [];

  if (Array.isArray(images) && images.length > 0) {
    return images;
  }

  if (project.image) {
    return [project.image];
  }

  return ["/assets/projects/project-placeholder.jpg"];
}

function getProjectTitle(t, project) {
  if (project.titleKey) {
    return t(project.titleKey, {
      defaultValue: project.title || project.slug || "Project",
    });
  }

  return project.title || "Project";
}

function getProjectDescription(t, project) {
  if (project.descriptionKey) {
    return t(project.descriptionKey, {
      defaultValue: project.description || "",
    });
  }

  return project.description || "";
}

function getProjectRole(t, project) {
  if (project.roleKey) {
    return t(project.roleKey, {
      defaultValue: project.role || "",
    });
  }

  return project.role || "";
}

function getProjectTags(t, project) {
  if (Array.isArray(project.tagKeys) && project.tagKeys.length > 0) {
    return project.tagKeys.map((tagKey) =>
      t(`work.projectTags.${tagKey}`, {
        defaultValue: tagKey,
      })
    );
  }

  return project.tags || [];
}

function getProjectHighlights(t, project) {
  if (Array.isArray(project.highlightKeys) && project.highlightKeys.length > 0) {
    return project.highlightKeys.map((highlightKey) =>
      t(highlightKey, {
        defaultValue: "",
      })
    );
  }

  return project.highlights || [];
}

function getTranslatedValue(t, key, fallback = "") {
  if (!key) return fallback;

  return t(key, {
    defaultValue: fallback,
  });
}

function PortfolioModal({ project, onClose, shouldReduceMotion }) {
  const { t } = useTranslation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("portfolio-modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("portfolio-modal-open");
    };
  }, [project, onClose]);

  if (!project) return null;

  const title = getProjectTitle(t, project);
  const description = getProjectDescription(t, project);
  const role = getProjectRole(t, project);
  const tags = getProjectTags(t, project);
  const highlights = getProjectHighlights(t, project).filter(Boolean);
  const images = getProjectImages(project);

  const projectType = getTranslatedValue(t, project.typeKey);
  const projectStatus = getTranslatedValue(t, project.statusKey);
  const projectVisibility = getTranslatedValue(t, project.visibilityKey);

  const hasExternalLink = project.link && project.link !== "#";

  return (
    <motion.div
      className="portfolio__modal-backdrop"
      role="presentation"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? {} : { opacity: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.22 }}
      onMouseDown={onClose}
    >
      <motion.article
        className="portfolio__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-modal-title"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.98 }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="portfolio__modal-close"
          aria-label={t("work.closeProjectModal", {
            defaultValue: "Close project details",
          })}
          onClick={onClose}
        >
          <FiX aria-hidden="true" />
        </button>

        <div className="portfolio__modal-scroll">
          <header className="portfolio__modal-header">
            <span className="portfolio__modal-eyebrow">
              {t("work.projectDetails", {
                defaultValue: "Project details",
              })}
            </span>

            <h3 id="portfolio-modal-title" className="portfolio__modal-title">
              {title}
            </h3>

            {role ? <p className="portfolio__modal-role">{role}</p> : null}
          </header>

          <div className="portfolio__modal-grid">
            <div className="portfolio__modal-media">
              <div className="portfolio__modal-main-image">
                <img src={images[activeImageIndex]} alt={title} />
              </div>

              {images.length > 1 ? (
                <div className="portfolio__modal-thumbs">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`portfolio__modal-thumb ${
                        activeImageIndex === index ? "is-active" : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={t("work.viewProjectImage", {
                        index: index + 1,
                        defaultValue: `View image ${index + 1}`,
                      })}
                    >
                      <img src={image} alt="" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="portfolio__modal-content">
              <div className="portfolio__modal-meta">
                {projectType ? (
                  <span className="portfolio__modal-meta-card">
                    {projectType}
                  </span>
                ) : null}

                {projectStatus ? (
                  <span className="portfolio__modal-meta-card">
                    {projectStatus}
                  </span>
                ) : null}

                {projectVisibility ? (
                  <span className="portfolio__modal-meta-card">
                    {projectVisibility}
                  </span>
                ) : null}
              </div>

              {description ? (
                <section className="portfolio__modal-section">
                  <h4>
                    {t("work.overviewTitle", {
                      defaultValue: "Overview",
                    })}
                  </h4>

                  <p>{description}</p>
                </section>
              ) : null}

              {highlights.length ? (
                <section className="portfolio__modal-section">
                  <h4>
                    {t("work.highlightsTitle", {
                      defaultValue: "Highlights",
                    })}
                  </h4>

                  <ul className="portfolio__modal-highlights">
                    {highlights.map((highlight, index) => (
                      <li key={`${project.id}-highlight-${index}`}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {tags.length ? (
                <section className="portfolio__modal-section">
                  <h4>
                    {t("work.technologiesTitle", {
                      defaultValue: "Technologies and focus",
                    })}
                  </h4>

                  <div className="portfolio__modal-tags">
                    {tags.map((tag) => (
                      <span key={tag} className="portfolio__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="portfolio__modal-actions">
                {hasExternalLink ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio__modal-link"
                  >
                    <span>
                      {t("work.openProject", {
                        defaultValue: "Open project",
                      })}
                    </span>
                    <FiExternalLink aria-hidden="true" />
                  </a>
                ) : (
                  <p className="portfolio__modal-private-note">
                    {t("work.privateProjectNote", {
                      defaultValue:
                        "This is a private project, so public access is not available.",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function Portfolio() {
  const { t } = useTranslation();

  const [preview, setPreview] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    damping: 24,
    stiffness: 220,
    mass: 0.55,
  });

  const springY = useSpring(mouseY, {
    damping: 24,
    stiffness: 220,
    mass: 0.55,
  });

  const safeProjects = useMemo(() => portfolioProjects ?? [], []);

  const handleMouseMove = (event) => {
    if (shouldReduceMotion || selectedProject) return;

    mouseX.set(event.clientX + 28);
    mouseY.set(event.clientY - 88);
  };

  const handlePreviewEnter = (project) => {
    if (shouldReduceMotion || selectedProject) return;
    setPreview(project);
  };

  const handlePreviewLeave = () => {
    setPreview(null);
  };

  const handleOpenProject = (project) => {
    setPreview(null);
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  return (
    <section className="portfolio" id="portfolio">
      <div className="c-space">
        <div className="portfolio__shell">
          <motion.div
            className="portfolio__heading"
            variants={headingRevealVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={revealViewport}
          >
            <span className="portfolio__eyebrow">
              {t("work.eyebrow", {
                defaultValue: "Portfolio",
              })}
            </span>

            <h2 className="portfolio__title-main">
              {t("work.title", {
                defaultValue: "Projetos selecionados",
              })}
            </h2>

            <p className="portfolio__intro">
              {t("work.description", {
                defaultValue:
                  "Uma seleção de projetos com foco em produto, interface, lógica de negócio e experiência visual.",
              })}
            </p>
          </motion.div>

          <div
            className="portfolio__list"
            onMouseMove={handleMouseMove}
            onMouseLeave={handlePreviewLeave}
          >
            {safeProjects.map((project, index) => {
              const title = getProjectTitle(t, project);
              const description = getProjectDescription(t, project);
              const role = getProjectRole(t, project);
              const tags = getProjectTags(t, project);

              return (
                <motion.article
                  key={project.id}
                  className="portfolio__item"
                  custom={index}
                  variants={projectRevealVariants}
                  initial={shouldReduceMotion ? false : "hidden"}
                  whileInView={shouldReduceMotion ? undefined : "visible"}
                  viewport={revealViewport}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -6,
                          transition: {
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                  }
                  onMouseEnter={() => handlePreviewEnter(project)}
                >
                  <div className="portfolio__content">
                    <div className="portfolio__meta">
                      <span className="portfolio__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {project.statusKey ? (
                        <span
                          className={`portfolio__status ${
                            project.statusKey
                              ?.toLowerCase()
                              .includes("production")
                              ? "is-production"
                              : project.statusKey
                                    ?.toLowerCase()
                                    .includes("development")
                                ? "is-development"
                                : ""
                          }`}
                        >
                          {t(project.statusKey, {
                            defaultValue: "",
                          })}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="portfolio__item-title">{title}</h3>

                    {role ? <p className="portfolio__role">{role}</p> : null}

                    {tags.length ? (
                      <div className="portfolio__tags">
                        {tags.slice(0, 6).map((tag) => (
                          <span key={tag} className="portfolio__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {description ? (
                      <p className="portfolio__description">{description}</p>
                    ) : null}
                  </div>

                  <div className="portfolio__actions">
                    <button
                      type="button"
                      className="portfolio__readmore"
                      aria-label={t("work.readMoreProjectAria", {
                        project: title,
                        defaultValue: `Open details for ${title}`,
                      })}
                      onClick={() => handleOpenProject(project)}
                      onMouseEnter={() => handlePreviewEnter(project)}
                      onFocus={() => setPreview(project)}
                      onBlur={handlePreviewLeave}
                    >
                      <span>
                        {t("work.readMore", {
                          defaultValue: "Read More",
                        })}
                      </span>
                      <FiArrowUpRight aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              );
            })}

            <AnimatePresence>
              {preview && !shouldReduceMotion && !selectedProject && (
                <motion.div
                  className="portfolio__preview"
                  style={{ x: springX, y: springY }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="portfolio__preview-media">
                    <img
                      src={getProjectImages(preview)[0]}
                      alt={getProjectTitle(t, preview)}
                      className="portfolio__preview-image"
                    />
                  </div>

                  <div className="portfolio__preview-body">
                    <span className="portfolio__preview-label">
                      {t("work.previewLabel", {
                        defaultValue: "Preview",
                      })}
                    </span>

                    <strong className="portfolio__preview-title">
                      {getProjectTitle(t, preview)}
                    </strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <PortfolioModal
            project={selectedProject}
            onClose={handleCloseProject}
            shouldReduceMotion={shouldReduceMotion}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default Portfolio;