// src/components/Hero/Hero.jsx
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Camping } from "../models/Camping";
import "./Hero.css";

function AnimatedWord() {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [wrapWidth, setWrapWidth] = useState(0);
  const sizerRef = useRef(null);

  const words = useMemo(() => {
    const value = t("hero.rotatingWords", { returnObjects: true });
    return Array.isArray(value) ? value.map(String) : [];
  }, [t, i18n.resolvedLanguage]);

  useEffect(() => {
    setIndex(0);
  }, [words]);

  useEffect(() => {
    if (!words.length || shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [words.length, shouldReduceMotion]);

  useLayoutEffect(() => {
    const el = sizerRef.current;
    if (!el || !words.length) return;

    let frame = 0;

    const measure = () => {
      const spans = Array.from(el.querySelectorAll("[data-word-sizer]"));
      const nextWidth = Math.ceil(
        Math.max(...spans.map((span) => span.getBoundingClientRect().width), 0)
      );
      setWrapWidth(nextWidth);
    };

    frame = window.requestAnimationFrame(measure);

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    });

    resizeObserver.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [words, i18n.resolvedLanguage]);

  if (!words.length) return null;

  if (shouldReduceMotion) {
    return (
      <span className="hero__word-wrap hero__word-wrap--static">
        <span className="hero__word hero__word--static">{words[0]}</span>
      </span>
    );
  }

  return (
    <span
      className="hero__word-wrap"
      aria-hidden="true"
      style={wrapWidth ? { width: `${wrapWidth}px` } : undefined}
    >
      <span ref={sizerRef} className="hero__word-sizer" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} data-word-sizer>
            {word}
          </span>
        ))}
      </span>

      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={`${i18n.resolvedLanguage}-${index}-${words[index]}`}
          className="hero__word"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const { t } = useTranslation();

  const cameraSettings = isMobile
    ? { position: [0, 0.25, 6], fov: 34 }
    : { position: [0, 0.45, 5.7], fov: 32 };

  const orbitTarget = isMobile ? [0, -1.38, 0] : [0, -1.45, 0];
  const campingScale = isMobile ? 0.09 : 0.15;
  const campingPosition = isMobile ? [-0.28, -1.82, 0] : [0, -2, 0];

  return (
    <section className="hero" id="home">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__overlay" />
      </div>

      <div className="c-space hero__container">
        <div className="hero__content-zone">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <motion.p
              className="hero__eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
            >
              {t("hero.eyebrow")}
            </motion.p>

            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.55 }}
            >
              <span className="hero__line">{t("hero.titleLine1")}</span>

              <span className="hero__line hero__line--inline">
                <span className="hero__title-soft">{t("hero.titleLine2")}</span>
                <AnimatedWord />
              </span>
            </motion.h1>

            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
            >
              {/* <a href="#portfolio" className="hero__primary">
                {t("hero.ctaPrimary")}
              </a>

              <a href="#about" className="hero__secondary">
                {t("hero.ctaSecondary")}
              </a> */}
            </motion.div>
          </motion.div>
        </div>

        <div className="hero__canvas-zone">
          <motion.figure
            className="hero__canvas-shell"
            aria-hidden="true"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.75, ease: "easeOut" }}
          >
            <div className="hero__canvas">
              <Canvas camera={cameraSettings} shadows dpr={[1, 2]}>
                <OrbitControls
                  makeDefault
                  enableZoom={false}
                  enablePan={false}
                  enableRotate
                  autoRotate={false}
                  enableDamping
                  dampingFactor={0.08}
                  rotateSpeed={isMobile ? 0.95 : 0.8}
                  minPolarAngle={Math.PI / 2.22}
                  maxPolarAngle={Math.PI / 1.9}
                  target={orbitTarget}
                />

                <Suspense fallback={null}>
                  <ambientLight intensity={1.18} />

                  <directionalLight
                    position={[4, 5, 3]}
                    intensity={2.15}
                    castShadow
                  />

                  <spotLight
                    position={[-4, 6, 5]}
                    intensity={1.85}
                    angle={0.36}
                    penumbra={1}
                    castShadow
                  />

                  <Camping
                    scale={campingScale}
                    position={campingPosition}
                    rotation={[0, 24.2, 0]}
                  />

                </Suspense>
              </Canvas>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

export default Hero;