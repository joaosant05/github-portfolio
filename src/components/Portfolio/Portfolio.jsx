import { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";
import { portfolioProjects } from "../../../public/data/portfolioData";
import "./Portfolio.css";

function Portfolio() {
  const [preview, setPreview] = useState(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 18, stiffness: 160 });
  const springY = useSpring(y, { damping: 18, stiffness: 160 });

  const safeProjects = useMemo(() => portfolioProjects ?? [], []);

  const handleMouseMove = (event) => {
    x.set(event.clientX + 24);
    y.set(event.clientY - 80);
  };

  return (
    <section className="portfolio section-spacing" id="portfolio">
      <div className="c-space">
        <div className="portfolio__heading">
          <p className="headtext">Portfolio</p>
          <h2 className="text-heading">Projetos selecionados</h2>
        </div>

        <div
          className="portfolio__list"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPreview(null)}
        >
          {safeProjects.map((project) => (
            <article
              key={project.id}
              className="portfolio__item"
              onMouseEnter={() => setPreview(project)}
            >
              <div className="portfolio__left">
                <h3 className="portfolio__title">{project.title}</h3>

                <div className="portfolio__tags">
                  {project.tags?.map((tag) => (
                    <span key={tag} className="portfolio__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="portfolio__description">{project.description}</p>
              </div>

              <a
                href={project.link || "#"}
                target="_blank"
                rel="noreferrer"
                className="portfolio__readmore"
              >
                Read More
                <FiArrowUpRight />
              </a>
            </article>
          ))}

          {preview && (
            <motion.div
              className="portfolio__preview"
              style={{ x: springX, y: springY }}
            >
              <img
                src={preview.image}
                alt={preview.title}
                className="portfolio__preview-image"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;