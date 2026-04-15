import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";
import { portfolioProjects } from "../../data/portfolioData";
import "./Portfolio.css";

function Portfolio() {
  const [preview, setPreview] = useState(null);
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
    if (shouldReduceMotion) return;

    mouseX.set(event.clientX + 28);
    mouseY.set(event.clientY - 88);
  };

  const handlePreviewEnter = (project) => {
    if (shouldReduceMotion) return;
    setPreview(project);
  };

  const handlePreviewLeave = () => {
    setPreview(null);
  };

  return (
    <section className="portfolio" id="portfolio">
      <div className="c-space">
        <div className="portfolio__shell">
          <motion.div
            className="portfolio__heading"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="portfolio__eyebrow">Portfolio</span>
            <h2 className="portfolio__title-main">Projetos selecionados</h2>
            <p className="portfolio__intro">
              Uma seleção de projetos com foco em produto, interface, lógica de
              negócio e experiência visual.
            </p>
          </motion.div>

          <div
            className="portfolio__list"
            onMouseMove={handleMouseMove}
            onMouseLeave={handlePreviewLeave}
          >
            {safeProjects.map((project, index) => (
              <motion.article
                key={project.id}
                className="portfolio__item"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => handlePreviewEnter(project)}
              >
                <div className="portfolio__left">
                  <div className="portfolio__meta">
                    <span className="portfolio__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="portfolio__item-title">{project.title}</h3>

                  {!!project.tags?.length && (
                    <div className="portfolio__tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="portfolio__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="portfolio__description">{project.description}</p>
                </div>

                <a
                  href={project.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="portfolio__readmore"
                  aria-label={`Abrir projeto ${project.title}`}
                  onMouseEnter={() => handlePreviewEnter(project)}
                  onFocus={() => setPreview(project)}
                  onBlur={handlePreviewLeave}
                >
                  <span>Read More</span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              </motion.article>
            ))}

            <AnimatePresence>
              {preview && !shouldReduceMotion && (
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
                      src={preview.image}
                      alt={preview.title}
                      className="portfolio__preview-image"
                    />
                  </div>

                  <div className="portfolio__preview-body">
                    <span className="portfolio__preview-label">Preview</span>
                    <strong className="portfolio__preview-title">
                      {preview.title}
                    </strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;