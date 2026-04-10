import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import achievementsData from "../../data/achivements";
import "./About.css";

const logoModules = import.meta.glob("../../components/models/logos/*.jsx", {
  eager: true,
});

function normalizeLogoKey(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const logoRegistry = Object.entries(logoModules).reduce((acc, [path, mod]) => {
  const fileName = path.split("/").pop()?.replace(".jsx", "") || "";
  const component =
    mod.default ||
    Object.values(mod).find((value) => typeof value === "function");

  if (component) {
    acc[normalizeLogoKey(fileName)] = component;
  }

  return acc;
}, {});

const stackItems = [
  {
    name: "React",
    modelKey: "React",
    category: "Front-end",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.05],
      fov: 34,
      scale: 0.9,
      position: [-0.1, -0.01, 0],
      rotation: [0.08, -0.42, 0],
      minAzimuthAngle: -0.62,
      maxAzimuthAngle: 0.38,
      minPolarAngle: Math.PI / 2 - 0.28,
      maxPolarAngle: Math.PI / 2 + 0.18,
    },
  },
  {
    name: "JavaScript",
    modelKey: "Javascript",
    category: "Front-end",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 3.4],
      fov: 34,
      scale: 2.28,
      position: [0, -0.02, 0],
      rotation: [0.08, 0.34, 0],
      minAzimuthAngle: -0.5,
      maxAzimuthAngle: 0.5,
      minPolarAngle: Math.PI / 2 - 0.24,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "TypeScript",
    modelKey: "Typescript",
    category: "Front-end",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 3.42],
      fov: 34,
      scale: 2.22,
      position: [0, -0.02, 0],
      rotation: [0.08, 0.34, 0],
      minAzimuthAngle: -0.5,
      maxAzimuthAngle: 0.5,
      minPolarAngle: Math.PI / 2 - 0.24,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "Python",
    modelKey: "Python",
    category: "Back-end",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.2],
      fov: 34,
      scale: 0.82,
      position: [0, -0.06, 0],
      rotation: [0.08, 0.24, 0],
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.24,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "FastAPI",
    modelKey: "Fastapi",
    category: "Back-end",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 4.72],
      fov: 34,
      scale: 0.74,
      position: [-0.12, -0.02, 0],
      rotation: [1.22, 0.2, -0.06],
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "Java",
    modelKey: "Java",
    category: "Back-end",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.02],
      fov: 34,
      scale: 0.8,
      position: [-0.05, -0.08, 0],
      rotation: [0.08, -0.6, 0],
      minAzimuthAngle: -0.54,
      maxAzimuthAngle: 0.34,
      minPolarAngle: Math.PI / 2 - 0.22,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "C#",
    modelKey: "CSharp",
    category: "Back-end",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 4.88],
      fov: 34,
      scale: 0.78,
      position: [0, -0.06, 0],
      rotation: [0.08, 0.12, 0],
      minAzimuthAngle: -0.38,
      maxAzimuthAngle: 0.38,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "MySQL",
    modelKey: "Mysql",
    category: "Banco de dados",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.15],
      fov: 34,
      scale: 0.66,
      position: [0, -0.04, 0],
      rotation: [0.08, 0.18, 0],
      minAzimuthAngle: -0.38,
      maxAzimuthAngle: 0.38,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "Git",
    modelKey: "Git",
    category: "Versionamento",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 4.28],
      fov: 34,
      scale: 0.96,
      position: [0, -0.02, 0],
      rotation: [0.98, 0.22, -0.04],
      minAzimuthAngle: -0.44,
      maxAzimuthAngle: 0.44,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "Docker",
    modelKey: "Docker",
    category: "DevOps",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 3.18],
      fov: 34,
      scale: 2.65,
      position: [0, 0, 0],
      rotation: [0.08, 0.26, 0],
      minAzimuthAngle: -0.44,
      maxAzimuthAngle: 0.44,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "Azure DevOps",
    modelKey: "Devops",
    category: "DevOps",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.08],
      fov: 34,
      scale: 0.68,
      position: [0, -0.01, 0],
      rotation: [1.06, 0.24, -0.02],
      minAzimuthAngle: -0.4,
      maxAzimuthAngle: 0.4,
      minPolarAngle: Math.PI / 2 - 0.18,
      maxPolarAngle: Math.PI / 2 + 0.12,
    },
  },
  {
    name: "DigitalOcean",
    modelKey: "DigitalOcean",
    category: "Cloud",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.42],
      fov: 34,
      scale: 0.56,
      position: [0, -0.01, 0],
      rotation: [1.02, 0.2, -0.02],
      minAzimuthAngle: -0.4,
      maxAzimuthAngle: 0.4,
      minPolarAngle: Math.PI / 2 - 0.18,
      maxPolarAngle: Math.PI / 2 + 0.12,
    },
  },
  {
    name: "Figma",
    modelKey: "Figma",
    category: "Design",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.08],
      fov: 34,
      scale: 0.66,
      position: [0, -0.01, 0],
      rotation: [0.86, 0.18, -0.04],
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.18,
      maxPolarAngle: Math.PI / 2 + 0.12,
    },
  },
  {
    name: "Illustrator",
    modelKey: "Illustrator",
    category: "Design",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.02],
      fov: 34,
      scale: 0.74,
      position: [0, -0.04, 0],
      rotation: [0.08, -0.3, 0],
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
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

function StackModelCanvas({ item }) {
  const ModelComponent =
    logoRegistry[normalizeLogoKey(item.modelKey || item.name)];

  const viewer = item.viewer || {};

  if (!ModelComponent) {
    return (
      <div className="about__stack-model-fallback">
        {item.name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.15]}
      shadows={false}
      camera={{
        position: viewer.cameraPosition || [0, 0, 4.2],
        fov: viewer.fov || 34,
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={1.08} />
      <directionalLight position={[3.2, 3.2, 4]} intensity={1.6} />
      <directionalLight position={[-3, -2, 3]} intensity={0.72} />

      <Suspense fallback={null}>
        <group>
          <ModelComponent
            scale={viewer.scale ?? 1.08}
            position={viewer.position ?? [0, -0.12, 0]}
            rotation={viewer.rotation ?? [0.08, 0.35, 0]}
          />
        </group>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.78}
          minAzimuthAngle={viewer.minAzimuthAngle ?? -0.45}
          maxAzimuthAngle={viewer.maxAzimuthAngle ?? 0.45}
          minPolarAngle={viewer.minPolarAngle ?? Math.PI / 2 - 0.26}
          maxPolarAngle={viewer.maxPolarAngle ?? Math.PI / 2 + 0.18}
        />
      </Suspense>
    </Canvas>
  );
}

function TechStackCard({ item, scrollRootRef }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    const root = scrollRootRef.current;

    if (!element || !root) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root,
        threshold: 0.35,
        rootMargin: "0px 120px 0px 120px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [scrollRootRef]);

  return (
    <article
      ref={cardRef}
      className={`about__stack-card ${item.proficient ? "is-proficient" : ""}`}
      aria-label={`${item.name} - ${item.category}`}
    >
      <div className="about__stack-card-top">
        <span className="about__stack-category">{item.category}</span>
      </div>

      <div className="about__stack-model-shell" aria-hidden="true">
        {isVisible ? <StackModelCanvas item={item} /> : null}
      </div>

      <div className="about__stack-card-bottom">
        <h4>{item.name}</h4>
      </div>
    </article>
  );
}

function About() {
  const { t, i18n } = useTranslation();
  const aboutRef = useRef(null);
  const stackScrollRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const [activePanel, setActivePanel] = useState(0);

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
    const element = aboutRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.intersectionRatio >= 0.25);
      },
      {
        threshold: [0, 0.15, 0.25, 0.45, 0.6],
        rootMargin: "-6% 0px -6% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handlePanelChange = (direction) => {
    setActivePanel((prev) => {
      const total = carouselItems.length;
      return (prev + direction + total) % total;
    });
  };

  const handleKeyNavigation = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePanelChange(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      handlePanelChange(1);
    }
  };

  const renderPanel = () => {
    if (activePanel === 0) {
      return (
        <article
          id="about-panel-bio"
          className="about__panel about__carousel-panel"
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
      );
    }

    if (activePanel === 1) {
      return (
        <article
          id="about-panel-stack"
          className="about__panel about__carousel-panel"
        >
          <div className="about__panel-head">
            <span className="about__eyebrow">
              {t("about.stackTitle", { defaultValue: "Tech Stack" })}
            </span>

            <p className="about__intro">
              {t("about.stackDescription", {
                defaultValue:
                  "Role horizontalmente para explorar os cards e arraste cada modelo 3D com liberdade controlada.",
              })}
            </p>
          </div>

          <div
            ref={stackScrollRef}
            className="about__stack-carousel"
            aria-label={t("about.stackAriaLabel", {
              defaultValue: "Tecnologias em carrossel horizontal",
            })}
          >
            {stackItems.map((item) => (
              <TechStackCard
                key={item.name}
                item={item}
                scrollRootRef={stackScrollRef}
              />
            ))}
          </div>
        </article>
      );
    }

    return (
      <article
        id="about-panel-achievements"
        className="about__panel about__carousel-panel"
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
                "Certificações, badges e marcos que fazem parte da minha trajetória.",
            })}
          </p>
        </div>

        {featuredAchievements.length ? (
          <div className="about__achievements-grid">
            {featuredAchievements.map((achievement, index) => (
              <article key={achievement.id} className="about__achievement">
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
              defaultValue: "Add achievements to src/data/achivements.js",
            })}
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="about" id="about">
      <div className="c-space">
        <div className="about__shell">
          <div
            ref={aboutRef}
            className={`about__carousel about__reveal ${
              isInView ? "is-visible" : ""
            }`}
            aria-roledescription="carousel"
            aria-label={t("about.carouselAriaLabel", {
              defaultValue: "About section carousel",
            })}
            tabIndex={0}
            onKeyDown={handleKeyNavigation}
          >
            <div className="about__carousel-viewport">
              <div className="about__carousel-stage">{renderPanel()}</div>

              <div className="about__edge-nav">
                <button
                  type="button"
                  className="about__edge-hit about__edge-hit--prev"
                  aria-label={t("about.previousPanel", {
                    defaultValue: "Painel anterior",
                  })}
                  onClick={() => handlePanelChange(-1)}
                >
                  <span className="about__sr-only">
                    {t("about.previousPanel", {
                      defaultValue: "Painel anterior",
                    })}
                  </span>
                </button>

                <button
                  type="button"
                  className="about__edge-hit about__edge-hit--next"
                  aria-label={t("about.nextPanel", {
                    defaultValue: "Próximo painel",
                  })}
                  onClick={() => handlePanelChange(1)}
                >
                  <span className="about__sr-only">
                    {t("about.nextPanel", {
                      defaultValue: "Próximo painel",
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;