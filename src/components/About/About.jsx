// src/components/About/About.jsx
import React, {
  Suspense,
  lazy,
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
import { profileConfig } from "../../data/siteConfig";
import { socialIconMap } from "../../utils/socialIcons";
import "./About.css";

function normalizeLogoKey(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const loadModel = (importer) =>
  lazy(() => importer().then((module) => ({ default: module.Model })));

const logoRegistry = {
  csharp: loadModel(() => import("../models/logos/CSharp")),
  devops: loadModel(() => import("../models/logos/Devops")),
  digitalocean: loadModel(() => import("../models/logos/DigitalOcean")),
  docker: loadModel(() => import("../models/logos/Docker")),
  fastapi: loadModel(() => import("../models/logos/Fastapi")),
  figma: loadModel(() => import("../models/logos/Figma")),
  git: loadModel(() => import("../models/logos/Git")),
  illustrator: loadModel(() => import("../models/logos/Illustrator")),
  java: loadModel(() => import("../models/logos/Java")),
  javascript: loadModel(() => import("../models/logos/Javascript")),
  mysql: loadModel(() => import("../models/logos/Mysql")),
  python: loadModel(() => import("../models/logos/Python")),
  react: loadModel(() => import("../models/logos/React")),
  typescript: loadModel(() => import("../models/logos/Typescript")),
};

const stackFallbackIconMap = {
  csharp: { src: "/assets/logos/stacks/csharp.svg", scale: 0.98 },
  devops: { src: "/assets/logos/stacks/azure-devops.svg", scale: 0.96 },
  digitalocean: {
    src: "/assets/logos/stacks/digital-ocean-icon.svg",
    scale: 0.98,
  },
  docker: { src: "/assets/logos/stacks/docker-icon.svg", scale: 1 },
  fastapi: { src: "/assets/logos/stacks/fastapi-icon.svg", scale: 0.98 },
  figma: { src: "/assets/logos/stacks/figma.svg", scale: 0.76 },
  git: { src: "/assets/logos/stacks/git-icon.svg", scale: 0.96 },
  illustrator: {
    src: "/assets/logos/stacks/adobe-illustrator.svg",
    scale: 0.94,
  },
  java: { src: "/assets/logos/stacks/java.svg", scale: 0.9 },
  javascript: { src: "/assets/logos/stacks/javascript.svg", scale: 0.96 },
  mysql: { src: "/assets/logos/stacks/mysql-icon.svg", scale: 0.92 },
  python: { src: "/assets/logos/stacks/python.svg", scale: 0.98 },
  react: { src: "/assets/logos/stacks/react.svg", scale: 0.98 },
  typescript: { src: "/assets/logos/stacks/typescript.svg", scale: 0.96 },
};

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

const aboutSocialLinks = profileConfig.socialLinks;

function getDateLocale(language) {
  if (!language) return "en-US";
  return language.toLowerCase().includes("pt") ? "pt-BR" : "en-US";
}

function parseAchievementDate(value) {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value, language) {
  if (!value) return "--";

  const date = parseAchievementDate(value);
  if (!date) return value;

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

function StackVisualFallback({ item }) {
  const logoKey = normalizeLogoKey(item.modelKey || item.name);
  const iconConfig = stackFallbackIconMap[logoKey];
  const iconSrc = iconConfig?.src;

  return (
    <div className="about__stack-model-fallback">
      {iconSrc ? (
        <img
          className="about__stack-model-fallback-icon"
          src={iconSrc}
          alt=""
          loading="eager"
          decoding="sync"
          style={{
            "--fallback-scale": iconConfig.scale ?? 1,
            "--fallback-x": `${iconConfig.x ?? 0}px`,
            "--fallback-y": `${iconConfig.y ?? 0}px`,
          }}
        />
      ) : (
        item.name.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}

function FloatingModel({ item, viewer, ModelComponent, reduceMotion = false }) {
  const rootRef = useRef(null);
  const spinRef = useRef(null);
  const StackLogo = ModelComponent;

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

  useFrame(() => {
    const root = rootRef.current;
    const spin = spinRef.current;

    if (!root || !spin) return;

    root.position.set(...basePosition);
    root.rotation.set(...baseRotation);

    spin.rotation.set(0, 0, 0);

    if (reduceMotion) return;

    const t = performance.now() / 1000;
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
        <StackLogo scale={viewer.scale ?? 1.08} />
      </group>
    </group>
  );
}

const StackModelCanvas = memo(function StackModelCanvas({
  item,
  reduceMotion,
  isInteractive = true,
  animateModel = true,
}) {
  const ModelComponent =
    logoRegistry[normalizeLogoKey(item.modelKey || item.name)];

  const viewer = item.viewer || {};

  if (!ModelComponent) {
    return <StackVisualFallback item={item} />;
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
        dpr={animateModel ? [1, 1.35] : 1}
        shadows={false}
        frameloop={animateModel && !reduceMotion ? "always" : "demand"}
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
              reduceMotion={reduceMotion || !animateModel}
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
    case -2:
      return "is-far-prev";
    case 2:
      return "is-far-next";
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

  const handleModelPointerDown = (event) => {
    if (!isActive) return;

    event.stopPropagation();
    onInteractionStart?.();
  };

  const handleModelClick = (event) => {
    if (!isActive) return;

    event.stopPropagation();
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

      <div
        className="about__stack-model-shell"
        aria-hidden="true"
        onClick={handleModelClick}
        onPointerDown={handleModelPointerDown}
      >
        {renderModel ? (
          <StackModelCanvas
            item={item}
            reduceMotion={reduceMotion}
            isInteractive={isActive}
            animateModel={isActive}
          />
        ) : (
          <StackVisualFallback item={item} />
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
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    defaultStep: 0,
    moved: false,
    isHorizontal: false,
  });
  const panelGestureRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    moved: false,
    isHorizontal: false,
  });

  const [isInView, setIsInView] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [activeStackIndex, setActiveStackIndex] = useState(2);
  const [isStackPaused, setIsStackPaused] = useState(false);
  const [isStackInteracting, setIsStackInteracting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isStackDragging, setIsStackDragging] = useState(false);
  const shouldRenderStackModel = activePanel === 1;

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
          achievement.descriptionKey
            ? t(achievement.descriptionKey, {
                defaultValue:
                  achievement.description ||
                  achievement.summary ||
                  achievement.text ||
                  "",
              })
            : achievement.description ||
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
      .sort(
        (a, b) =>
          (parseAchievementDate(b.issuedAt)?.getTime() || 0) -
          (parseAchievementDate(a.issuedAt)?.getTime() || 0)
      );
  }, [t, i18n.language]);

  const featuredAchievements = useMemo(
    () => achievements,
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

  const keepCarouselInView = () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 980px)").matches) return;

    window.requestAnimationFrame(() => {
      aboutRef.current?.scrollIntoView({
        block: "start",
        behavior: "auto",
      });
    });
  };

  const selectPanel = (index) => {
    setActivePanel(index);
    keepCarouselInView();
  };

  const handlePanelChange = (direction) => {
    setActivePanel((prev) => {
      const total = carouselItems.length;
      return (prev + direction + total) % total;
    });
    keepCarouselInView();
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
    if (event.target.closest?.(".about__stack-model-shell")) return;
    event.stopPropagation();

    stackGestureRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      defaultStep: Number(event.currentTarget.dataset.step || 0),
      moved: false,
      isHorizontal: false,
    };

    setIsStackPaused(true);
    setIsStackDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveStackDrag = (event) => {
    const gesture = stackGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) return;
    event.stopPropagation();

    gesture.deltaX = event.clientX - gesture.startX;
    gesture.deltaY = event.clientY - gesture.startY;

    const absX = Math.abs(gesture.deltaX);
    const absY = Math.abs(gesture.deltaY);

    if (!gesture.moved && Math.max(absX, absY) > 10) {
      gesture.moved = true;
      gesture.isHorizontal = absX > absY * 1.15;
    }

    if (!gesture.isHorizontal) {
      return;
    }

    event.preventDefault();
  };

  const endStackDrag = (event) => {
    const gesture = stackGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) return;
    event.stopPropagation();

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
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      defaultStep: 0,
      moved: false,
      isHorizontal: false,
    };

    setIsStackDragging(false);
    setIsStackPaused(false);

    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const resetPanelSwipe = () => {
    panelGestureRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      isHorizontal: false,
    };
  };

  const startPanelSwipe = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest?.("a, button, .about__stack-carousel")) return;

    panelGestureRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      isHorizontal: false,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const movePanelSwipe = (event) => {
    const gesture = panelGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) return;

    gesture.deltaX = event.clientX - gesture.startX;
    gesture.deltaY = event.clientY - gesture.startY;

    const absX = Math.abs(gesture.deltaX);
    const absY = Math.abs(gesture.deltaY);

    if (!gesture.moved && Math.max(absX, absY) > 12) {
      gesture.moved = true;
      gesture.isHorizontal = absX > absY * 1.18;
    }

    if (gesture.isHorizontal) {
      event.preventDefault();
    }
  };

  const endPanelSwipe = (event) => {
    const gesture = panelGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) return;

    const threshold = 72;

    if (gesture.isHorizontal && Math.abs(gesture.deltaX) >= threshold) {
      handlePanelChange(gesture.deltaX < 0 ? 1 : -1);
    }

    resetPanelSwipe();
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
            <div
              className="about__carousel-viewport"
              onPointerDown={startPanelSwipe}
              onPointerMove={movePanelSwipe}
              onPointerUp={endPanelSwipe}
              onPointerCancel={endPanelSwipe}
            >
              <div className="about__carousel-stage">
                <article
                  id="about-panel-bio"
                  className={getPanelClassName(0)}
                  role="tabpanel"
                  aria-labelledby="about-tab-bio"
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

                      <div
                        className="about__social-block"
                        aria-label={t("about.socialsAriaLabel")}
                      >
                        <span className="about__social-title">
                          {t("about.connectTitle")}
                        </span>

                        <div className="about__social-links">
                          {aboutSocialLinks.map((link) => {
                            const Icon = socialIconMap[link.icon];

                            return (
                              <a
                                key={link.id}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="about__social-link"
                                aria-label={t("about.socialLinkAriaLabel", {
                                  label: link.label,
                                })}
                              >
                                {Icon ? <Icon aria-hidden="true" /> : null}
                                <span>{link.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article
                  id="about-panel-stack"
                  className={getPanelClassName(1)}
                  role="tabpanel"
                  aria-labelledby="about-tab-stack"
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
                    data-step="0"
                    aria-label={t("about.stackAriaLabel", {
                      defaultValue: "Infinite technology carousel",
                    })}
                    onPointerDown={startStackDrag}
                    onPointerMove={moveStackDrag}
                    onPointerUp={endStackDrag}
                    onPointerCancel={endStackDrag}
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

                        if (Math.abs(offset) > 2) return null;

                        return (
                          <TechStackCard
                            key={item.name}
                            item={item}
                            offset={offset}
                            onSelect={() => setActiveStackIndex(index)}
                            reduceMotion={reduceMotion}
                            renderModel={shouldRenderStackModel && offset === 0}
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
                  role="tabpanel"
                  aria-labelledby="about-tab-achievements"
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
                      id={`about-tab-${item.id}`}
                      type="button"
                      role="tab"
                      className={`about__carousel-dot ${
                        isActive ? "is-active" : ""
                      }`}
                      aria-selected={isActive}
                      aria-controls={`about-panel-${item.id}`}
                      aria-label={item.label}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectPanel(index)}
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
