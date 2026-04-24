// src/components/About/About.jsx
import React, {
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame } from "@react-three/fiber";
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
    categoryKey: "frontend",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.05],
      fov: 34,
      scale: 0.4,
      position: [-0.1, -0.01, 0],
      rotation: [0.08, -0.2, 0],
      minAzimuthAngle: -0.62,
      maxAzimuthAngle: 0.38,
      minPolarAngle: Math.PI / 2 - 0.28,
      maxPolarAngle: Math.PI / 2 + 0.18,
    },
  },
  {
    name: "JavaScript",
    modelKey: "Javascript",
    categoryKey: "frontend",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 3.35],
      fov: 34,
      scale: 10.2,
      position: [0, -0.55, 0],
      rotation: [0.08, 0, 0],
      target: [0, 0, 0],
      minAzimuthAngle: -0.5,
      maxAzimuthAngle: 0.5,
      minPolarAngle: Math.PI / 2 - 0.24,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "TypeScript",
    modelKey: "Typescript",
    categoryKey: "frontend",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 3.42],
      fov: 34,
      scale: 10.22,
      position: [0, -0.02, 0],
      rotation: [0.08, 0, 0],
      minAzimuthAngle: -0.5,
      maxAzimuthAngle: 0.5,
      minPolarAngle: Math.PI / 2 - 0.24,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "Python",
    modelKey: "Python",
    categoryKey: "backend",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.2],
      fov: 34,
      scale: 0.03,
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
    categoryKey: "backend",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 4.72],
      fov: 34,
      scale: 0.52,
      position: [0, 0.08, 0],
      target: [0, 0, 0],
      rotation: [1.5, 0.05, -0.08],
      spinAxis: "z",
      spinAmplitude: 0.18,
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "Java",
    modelKey: "Java",
    categoryKey: "backend",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.02],
      fov: 34,
      scale: 0.8,
      position: [-0.05, -0.08, 0],
      rotation: [0.08, -1.6, 0],
      minAzimuthAngle: -0.54,
      maxAzimuthAngle: 0.34,
      minPolarAngle: Math.PI / 2 - 0.22,
      maxPolarAngle: Math.PI / 2 + 0.16,
    },
  },
  {
    name: "C#",
    modelKey: "CSharp",
    categoryKey: "backend",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 4.88],
      fov: 34,
      scale: 0.025,
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
    categoryKey: "database",
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
    categoryKey: "versioning",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 4.28],
      fov: 34,
      scale: 0.96,
      position: [0, -0.02, 0],
      rotation: [1.5, 0, -0.04],
      spinAxis: "z",
      minAzimuthAngle: -0.44,
      maxAzimuthAngle: 0.44,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
  {
    name: "Docker",
    modelKey: "Docker",
    categoryKey: "containers",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 3.18],
      fov: 34,
      scale: 8.65,
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
    categoryKey: "devops",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 3.15],
      fov: 34,
      scale: 0.37,
      position: [0, -0.02, 0],
      target: [0, 0, 0],
      rotation: [1.4, 0, -0.02],
      spinAxis: "z",
      spinAmplitude: 0.18,
      minAzimuthAngle: -0.4,
      maxAzimuthAngle: 0.4,
      minPolarAngle: Math.PI / 2 - 0.18,
      maxPolarAngle: Math.PI / 2 + 0.12,
    },
  },
  {
    name: "DigitalOcean",
    modelKey: "DigitalOcean",
    categoryKey: "cloud",
    proficient: true,
    viewer: {
      cameraPosition: [0, 0, 5.42],
      fov: 34,
      scale: 0.32,
      position: [0, -0.02, 0],
      target: [0, 0, 0],
      rotation: [1.4, 0, -0.02],
      spinAxis: "z",
      spinAmplitude: 0.18,
      minAzimuthAngle: -0.4,
      maxAzimuthAngle: 0.4,
      minPolarAngle: Math.PI / 2 - 0.18,
      maxPolarAngle: Math.PI / 2 + 0.12,
    },
  },
  {
    name: "Figma",
    modelKey: "Figma",
    categoryKey: "design",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.08],
      fov: 34,
      scale: 0.52,
      position: [0, -0.02, 0],
      target: [0, 0, 0],
      rotation: [1.4, 0, -0.02],
      spinAxis: "z",
      spinAmplitude: 0.18,
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.18,
      maxPolarAngle: Math.PI / 2 + 0.12,
    },
  },
  {
    name: "Illustrator",
    modelKey: "Illustrator",
    categoryKey: "design",
    proficient: false,
    viewer: {
      cameraPosition: [0, 0, 5.02],
      fov: 34,
      scale: 0.74,
      position: [0, -0.04, 0],
      rotation: [0.08, -1.4, 0],
      minAzimuthAngle: -0.42,
      maxAzimuthAngle: 0.42,
      minPolarAngle: Math.PI / 2 - 0.2,
      maxPolarAngle: Math.PI / 2 + 0.14,
    },
  },
];

function getDateLocale(language) {
  if (!language) return "en-US";
  return language.toLowerCase().includes("pt") ? "pt-BR" : "en-US";
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

function FloatingModel({ item, viewer, ModelComponent, reduceMotion = false }) {
  const rootRef = useRef(null);
  const spinRef = useRef(null);

  const basePosition = useMemo(
    () => viewer.position ?? [0, -0.12, 0],
    [viewer.position]
  );

  const baseRotation = useMemo(
    () => viewer.rotation ?? [0.08, 0.35, 0],
    [viewer.rotation]
  );

  const seed = useMemo(() => {
    const key = normalizeLogoKey(item.modelKey || item.name || "model");
    return key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }, [item.modelKey, item.name]);

  const phase = useMemo(() => (seed % 360) * (Math.PI / 180), [seed]);

  useFrame((state) => {
    const root = rootRef.current;
    const spin = spinRef.current;

    if (!root || !spin) return;

    root.position.set(...basePosition);
    root.rotation.set(...baseRotation);

    spin.rotation.set(0, 0, 0);

    if (reduceMotion) return;

    const t = state.clock.getElapsedTime();
    const speed = 0.72 + (seed % 4) * 0.05;
    const spinAmplitude = viewer.spinAmplitude ?? viewer.yawAmplitude ?? 0.34;
    const spinValue = Math.sin(t * speed + phase) * spinAmplitude;
    const spinAxis = viewer.spinAxis ?? "y";

    if (spinAxis === "x") {
      spin.rotation.x = spinValue;
      return;
    }

    if (spinAxis === "z") {
      spin.rotation.z = spinValue;
      return;
    }

    spin.rotation.y = spinValue;
  });

  return (
    <group ref={rootRef}>
      <group ref={spinRef}>
        <ModelComponent scale={viewer.scale ?? 1.08} />
      </group>
    </group>
  );
}

const StackModelCanvas = memo(function StackModelCanvas({
  item,
  reduceMotion,
  isInteractive = true,
}) {
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
    <div
      className="about__stack-canvas-frame"
      style={{
        transform: `translate3d(${viewer.frameOffsetX ?? 0}px, ${
          viewer.frameOffsetY ?? 0
        }px, 0)`,
      }}
    >
      <Canvas
        dpr={[1, 1]}
        shadows={false}
        frameloop={isInteractive && !reduceMotion ? "always" : "demand"}
        camera={{
          position: viewer.cameraPosition || [0, 0, 4.2],
          fov: viewer.fov || 34,
          near: viewer.near ?? 0.01,
          far: viewer.far ?? 100,
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
            <FloatingModel
              item={item}
              viewer={viewer}
              ModelComponent={ModelComponent}
              reduceMotion={reduceMotion || !isInteractive}
            />
          </group>

          <OrbitControls
            enabled={isInteractive}
            enablePan={false}
            enableZoom={false}
            enableRotate={isInteractive}
            enableDamping={isInteractive}
            dampingFactor={0.16}
            rotateSpeed={0.38}
            target={viewer.target ?? viewer.position ?? [0, 0, 0]}
            minAzimuthAngle={viewer.minAzimuthAngle ?? -0.45}
            maxAzimuthAngle={viewer.maxAzimuthAngle ?? 0.45}
            minPolarAngle={viewer.minPolarAngle ?? Math.PI / 2 - 0.26}
            maxPolarAngle={viewer.maxPolarAngle ?? Math.PI / 2 + 0.18}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

function getCircularOffset(index, activeIndex, total) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getStackPositionClass(offset) {
  switch (offset) {
    case 0:
      return "is-center";
    case -1:
      return "is-near-prev";
    case 1:
      return "is-near-next";
    default:
      return "is-hidden";
  }
}

const TechStackCard = memo(function TechStackCard({
  item,
  offset,
  onSelect,
  reduceMotion,
  renderModel = true,
  onInteractionStart,
  onInteractionEnd,
}) {
  const { t } = useTranslation();
  const positionClass = getStackPositionClass(offset);
  const isActive = offset === 0;

  const categoryLabel = t(`about.stackCategories.${item.categoryKey}`, {
    defaultValue: item.categoryKey,
  });

  const featuredLabel = t("about.stackFeaturedAriaLabel", {
    stack: item.name,
    defaultValue:
      "{{stack}} é uma tecnologia de uso recorrente nos meus projetos",
  });

  const featuredTooltip = t("about.stackFeaturedTooltip", {
    defaultValue: "Tecnologia de uso recorrente nos meus projetos",
  });

  const handleBadgePointerLeave = (event) => {
    event.stopPropagation();

    if (!isActive) {
      onInteractionEnd?.();
    }
  };

  const handleBadgeBlur = (event) => {
    event.stopPropagation();

    if (!isActive) {
      onInteractionEnd?.();
    }
  };

  return (
    <article
      className={`about__stack-card ${
        item.proficient ? "is-proficient" : ""
      } ${positionClass} ${isActive ? "is-active" : ""}`}
      aria-label={`${item.name} - ${categoryLabel}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      onPointerEnter={isActive ? onInteractionStart : undefined}
      onPointerLeave={isActive ? onInteractionEnd : undefined}
      onPointerDown={isActive ? onInteractionStart : undefined}
      onPointerUp={isActive ? onInteractionEnd : undefined}
      onPointerCancel={isActive ? onInteractionEnd : undefined}
      onFocus={isActive ? onInteractionStart : undefined}
      onBlur={isActive ? onInteractionEnd : undefined}
    >
      {item.proficient ? (
        <span
          className="about__stack-featured-badge"
          role="img"
          aria-label={featuredLabel}
          tabIndex={isActive ? 0 : -1}
          onClick={(event) => event.stopPropagation()}
          onPointerEnter={(event) => {
            event.stopPropagation();
            onInteractionStart?.();
          }}
          onPointerLeave={handleBadgePointerLeave}
          onFocus={(event) => {
            event.stopPropagation();
            onInteractionStart?.();
          }}
          onBlur={handleBadgeBlur}
        >
          <span className="about__stack-featured-icon" aria-hidden="true">
            ★
          </span>

          <span className="about__stack-featured-tooltip" role="tooltip">
            {featuredTooltip}
          </span>
        </span>
      ) : null}

      <div className="about__stack-card-top">
        <span className="about__stack-category">{categoryLabel}</span>
      </div>

      <div className="about__stack-model-shell" aria-hidden="true">
        {renderModel ? (
          <StackModelCanvas
            item={item}
            reduceMotion={reduceMotion}
            isInteractive={isActive}
          />
        ) : (
          <div className="about__stack-model-fallback">
            {item.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="about__stack-card-bottom">
        <h4>{item.name}</h4>
      </div>
    </article>
  );
});

function About() {
  const { t, i18n } = useTranslation();
  const aboutRef = useRef(null);

  const stackGestureRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    deltaX: 0,
    defaultStep: 0,
    moved: false,
  });

  const [isInView, setIsInView] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [activeStackIndex, setActiveStackIndex] = useState(2);
  const [isStackPaused, setIsStackPaused] = useState(false);
  const [isStackInteracting, setIsStackInteracting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isStackDragging, setIsStackDragging] = useState(false);
  const [hasLoadedStackPanel, setHasLoadedStackPanel] = useState(false);

  const achievements = useMemo(() => {
    const list = Array.isArray(achievementsData) ? achievementsData : [];

    return [...list]
      .map((achievement, index) => ({
        id: achievement.id || `achievement-${index + 1}`,
        title:
          achievement.title ||
          achievement.name ||
          t("about.achievementUntitled", {
            defaultValue: "Untitled achievement",
          }),
        issuer:
          achievement.issuer ||
          achievement.organization ||
          achievement.company ||
          t("about.achievementUnknownIssuer", {
            defaultValue: "Issuer not informed",
          }),
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
  }, [t]);

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

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);

    syncPreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", syncPreference);
      return () => mediaQuery.removeEventListener("change", syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  useEffect(() => {
    if ((activePanel === 1 || isInView) && !hasLoadedStackPanel) {
      setHasLoadedStackPanel(true);
    }
  }, [activePanel, isInView, hasLoadedStackPanel]);

  useEffect(() => {
    if (
      activePanel !== 1 ||
      reduceMotion ||
      isStackPaused ||
      isStackInteracting
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveStackIndex((prev) => (prev + 1) % stackItems.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [activePanel, isStackPaused, isStackInteracting, reduceMotion]);

  const handlePanelChange = (direction) => {
    setActivePanel((prev) => {
      const total = carouselItems.length;
      return (prev + direction + total) % total;
    });
  };

  const handleStackStep = (direction) => {
    setActiveStackIndex((prev) => {
      const total = stackItems.length;
      return (prev + direction + total) % total;
    });
  };

  const handleStackInteractionStart = () => {
    setIsStackInteracting(true);
  };

  const handleStackInteractionEnd = () => {
    setIsStackInteracting(false);
  };

  const startStackDrag = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    stackGestureRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      deltaX: 0,
      defaultStep: Number(event.currentTarget.dataset.step || 0),
      moved: false,
    };

    setIsStackPaused(true);
    setIsStackDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveStackDrag = (event) => {
    const gesture = stackGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) return;

    gesture.deltaX = event.clientX - gesture.startX;

    if (Math.abs(gesture.deltaX) > 10) {
      gesture.moved = true;
    }

    event.preventDefault();
  };

  const endStackDrag = (event) => {
    const gesture = stackGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) return;

    const threshold = 64;

    if (gesture.moved) {
      if (gesture.deltaX <= -threshold) {
        handleStackStep(1);
      }

      if (gesture.deltaX >= threshold) {
        handleStackStep(-1);
      }
    } else if (gesture.defaultStep) {
      handleStackStep(gesture.defaultStep);
    }

    stackGestureRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      deltaX: 0,
      defaultStep: 0,
      moved: false,
    };

    setIsStackDragging(false);
    setIsStackPaused(false);

    event.currentTarget.releasePointerCapture?.(event.pointerId);
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

  const getPanelClassName = (index) =>
    `about__panel about__carousel-panel ${
      activePanel === index ? "is-active" : "is-inactive"
    }`;

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
              <div className="about__carousel-stage">
                <article
                  id="about-panel-bio"
                  className={getPanelClassName(0)}
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
                        alt={t("about.photoAlt", {
                          defaultValue: "Profile photo",
                        })}
                        className="about__image"
                      />
                    </div>

                    <div className="about__copy">
                      <h3>{t("about.name", { defaultValue: "Your name" })}</h3>

                      <p>
                        {t("about.paragraph1", {
                          defaultValue:
                            "Write here the first paragraph about your background, experience and the type of products you like to build.",
                        })}
                      </p>

                      <p>
                        {t("about.paragraph2", {
                          defaultValue:
                            "Use this second paragraph to reinforce your approach, values and the technologies you work with most often.",
                        })}
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  id="about-panel-stack"
                  className={getPanelClassName(1)}
                  aria-hidden={activePanel !== 1}
                >
                  <div className="about__panel-head">
                    <span className="about__eyebrow">
                      {t("about.stackTitle", { defaultValue: "Tech Stack" })}
                    </span>

                    <p className="about__intro">
                      {t("about.stackDescription", {
                        defaultValue:
                          "Technologies and tools I have already worked with throughout my projects.",
                      })}
                    </p>
                  </div>

                  <div
                    className={`about__stack-carousel ${
                      isStackDragging ? "is-dragging" : ""
                    }`}
                    aria-label={t("about.stackAriaLabel", {
                      defaultValue: "Infinite technology carousel",
                    })}
                  >
                    <div className="about__stack-drag-zones" aria-hidden="true">
                      <div
                        className="about__stack-drag-zone about__stack-drag-zone--left"
                        data-step="-1"
                        onPointerDown={startStackDrag}
                        onPointerMove={moveStackDrag}
                        onPointerUp={endStackDrag}
                        onPointerCancel={endStackDrag}
                      />

                      <div
                        className="about__stack-drag-zone about__stack-drag-zone--right"
                        data-step="1"
                        onPointerDown={startStackDrag}
                        onPointerMove={moveStackDrag}
                        onPointerUp={endStackDrag}
                        onPointerCancel={endStackDrag}
                      />
                    </div>

                    <div className="about__stack-carousel-track">
                      {stackItems.map((item, index) => {
                        const offset = getCircularOffset(
                          index,
                          activeStackIndex,
                          stackItems.length
                        );

                        if (Math.abs(offset) > 1) return null;

                        return (
                          <TechStackCard
                            key={item.name}
                            item={item}
                            offset={offset}
                            onSelect={() => setActiveStackIndex(index)}
                            reduceMotion={reduceMotion}
                            renderModel={hasLoadedStackPanel}
                            onInteractionStart={handleStackInteractionStart}
                            onInteractionEnd={handleStackInteractionEnd}
                          />
                        );
                      })}
                    </div>
                  </div>
                </article>

                <article
                  id="about-panel-achievements"
                  className={getPanelClassName(2)}
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
                          "Certifications, badges and milestones that are part of my journey.",
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
                                {formatDate(
                                  achievement.issuedAt,
                                  i18n.language
                                )}
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

              <div
                className="about__carousel-dots"
                role="tablist"
                aria-label={t("about.carouselPagination", {
                  defaultValue: "Panel navigation",
                })}
              >
                {carouselItems.map((item, index) => {
                  const isActive = activePanel === index;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      className={`about__carousel-dot ${
                        isActive ? "is-active" : ""
                      }`}
                      aria-selected={isActive}
                      aria-controls={`about-panel-${item.id}`}
                      aria-label={item.label}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActivePanel(index)}
                    >
                      <span className="about__sr-only">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;