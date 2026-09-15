// src/components/Hero/Hero.jsx
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import "./Hero.css";
const HeroScene = lazy(() => import("./HeroScene"));

const Motion = motion;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function AnimatedWord() {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [wrapWidth, setWrapWidth] = useState(0);
  const sizerRef = useRef(null);

  const words = useMemo(() => {
    const value = t("hero.rotatingWords", { returnObjects: true });
    return Array.isArray(value) ? value.map(String) : [];
  }, [t]);

  const activeIndex = words.length ? index % words.length : 0;

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
  }, [words]);

  if (!words.length) return null;

  if (shouldReduceMotion) {
    return (
      <span className="hero__word-wrap hero__word-wrap--static">
        <span className="hero__word hero__word--static">{words[0]}</span>
      </span>
    );
  }

  return (
    <>
      <span className="hero__sr-only">{words[0]}</span>

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
          <Motion.span
            key={`${i18n.resolvedLanguage}-${activeIndex}-${words[activeIndex]}`}
            className="hero__word"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {words[activeIndex]}
          </Motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}

function Hero() {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const hasTouchPrimaryInput = useMediaQuery({
    query: "(hover: none), (pointer: coarse)",
  });
  const { t, i18n } = useTranslation();
  const heroRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(() => !document.hidden);
  const [isModelReady, setIsModelReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    if (shouldReduceMotion) {
      el.style.setProperty("--hero-parallax-bg", "0px");
      el.style.setProperty("--hero-parallax-canvas", "0px");
      el.style.setProperty("--hero-parallax-content", "0px");
      el.style.setProperty("--hero-parallax-overlay-opacity", "0");
      return;
    }

    let raf = 0;

    const updateParallax = () => {
      raf = 0;

      const rect = el.getBoundingClientRect();
      const progress = clamp01(-rect.top / window.innerHeight);

      const bgY = progress * (isMobile ? 40 : 72);
      const canvasY = progress * (isMobile ? 22 : 38);
      const contentY = progress * (isMobile ? 55 : 90);
      const overlayOpacity = progress * 0.42;

      el.style.setProperty("--hero-parallax-bg", `${bgY}px`);
      el.style.setProperty("--hero-parallax-canvas", `${canvasY}px`);
      el.style.setProperty("--hero-parallax-content", `${contentY}px`);
      el.style.setProperty(
        "--hero-parallax-overlay-opacity",
        overlayOpacity.toFixed(3)
      );
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isMobile, shouldReduceMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting));
    observer.observe(heroRef.current);
    const updateVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const handleModelReady = useCallback(() => setIsModelReady(true), []);
  const isPortuguese = i18n.resolvedLanguage?.toLowerCase().startsWith("pt");

  return (
    <section ref={heroRef} className="hero" id="home">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__overlay" />
      </div>

      <div className="hero__canvas-zone">
        <Motion.figure
          className="hero__canvas-shell"
          aria-hidden="true"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.75, ease: "easeOut" }}
        >
          <div className="hero__canvas">
            {!isModelReady ? (
              <div className="hero__model-loader" aria-hidden="true">
                <span className="hero__model-loader-ring" />
                <span className="hero__model-loader-core" />
                <span className="hero__model-loader-shadow" />
              </div>
            ) : null}

            <Suspense fallback={null}>
              <HeroScene
                isMobile={isMobile}
                disableModelInteraction={isMobile || hasTouchPrimaryInput}
                isActive={isInView && isPageVisible}
                shouldReduceMotion={shouldReduceMotion}
                onReady={handleModelReady}
              />
            </Suspense>
          </div>
        </Motion.figure>
      </div>

      <div className="c-space hero__container">
        <div className="hero__content-zone">
          <Motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <Motion.p
              className="hero__eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
            >
              {t("hero.eyebrow")}
            </Motion.p>

            <Motion.h1
              className="hero__title hero__title--stacked"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.55 }}
            >
              <span className="hero__line">{t("hero.titleLine1")}</span>
              <span className="hero__line">{t("hero.titleLine2")}</span>

              {isPortuguese ? (
                <>
                  <span className="hero__line hero__line--solution">
                    <span className="hero__title-soft">
                      {t("hero.titleLine4")}
                    </span>
                  </span>

                  <span className="hero__line hero__line--word">
                    <AnimatedWord />
                  </span>
                </>
              ) : (
                <>
                  <span className="hero__line hero__line--word">
                    <AnimatedWord />
                  </span>

                  <span className="hero__line hero__line--solution">
                    <span className="hero__title-soft">
                      {t("hero.titleLine4")}
                    </span>
                  </span>
                </>
              )}
            </Motion.h1>

          </Motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
