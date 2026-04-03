// src/components/Hero/Hero.jsx
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { BB8 } from "../models/BB8";
import "./Hero.css";
import * as THREE from "three";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

const easeInCubic = (t) => t * t * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

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

function BB8Runner({ isMobile, controlsRef }) {
  const rootRef = useRef(null);
  const visualRef = useRef(null);
  const animRef = useRef(null);

  const dragRef = useRef({
    active: false,
    hovered: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
  });

  const RUN_CONFIG = useMemo(
    () => ({
      totalFrames: 299,
      moveStartFrame: 230,
      baseX: isMobile ? -0.9 : 1.3,
      baseY: isMobile ? -1.4 : -2.34,
      baseZ: -0.5,
      reentryZOffset: -1.3,
      wrapPadding: isMobile ? 0.52 : 0.68,
      scale: isMobile ? 1 : 2.2,
      dragRotateSpeedX: 0.0035,
      dragRotateSpeedY: 0.0085,
      maxDragTiltX: 0.35,
      dragFollowLerp: 0.18,
      dragReturnLerp: 0.08,
    }),
    [isMobile]
  );

  const setCursor = useCallback((value) => {
    document.body.style.cursor = value;
  }, []);

  const handleAnimationReady = useCallback((data) => {
    animRef.current = data;
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      e.target.setPointerCapture?.(e.pointerId);

      dragRef.current.active = true;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;

      if (controlsRef?.current) {
        controlsRef.current.enabled = false;
      }

      setCursor("grabbing");
    },
    [controlsRef, setCursor]
  );

  const handlePointerUpOnMesh = useCallback(
    (e) => {
      e.stopPropagation();
      e.target.releasePointerCapture?.(e.pointerId);

      const drag = dragRef.current;
      drag.active = false;
      drag.pointerId = null;

      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
      }

      setCursor(drag.hovered ? "grab" : "");
    },
    [controlsRef, setCursor]
  );

  const handlePointerOver = useCallback(
    (e) => {
      e.stopPropagation();
      dragRef.current.hovered = true;
      if (!dragRef.current.active) setCursor("grab");
    },
    [setCursor]
  );

  const handlePointerOut = useCallback(
    (e) => {
      e.stopPropagation();
      dragRef.current.hovered = false;
      if (!dragRef.current.active) setCursor("");
    },
    [setCursor]
  );

  const shadowTexture = useMemo(() => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    18,
    size / 2,
    size / 2,
    size / 2
  );

  gradient.addColorStop(0, "rgba(0,0,0,0.28)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.16)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}, []);

  useEffect(() => {
    if (!visualRef.current) return;

    visualRef.current.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const drag = dragRef.current;
      if (!drag.active) return;

      const deltaX = e.clientX - drag.lastX;
      const deltaY = e.clientY - drag.lastY;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;

      drag.targetRotY += deltaX * RUN_CONFIG.dragRotateSpeedY;
      drag.targetRotX = clamp(
        drag.targetRotX + deltaY * RUN_CONFIG.dragRotateSpeedX,
        -RUN_CONFIG.maxDragTiltX,
        RUN_CONFIG.maxDragTiltX
      );
    };

    const handleWindowPointerUp = () => {
      const drag = dragRef.current;
      if (!drag.active) return;

      drag.active = false;
      drag.pointerId = null;

      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
      }

      setCursor(drag.hovered ? "grab" : "");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);

      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
      }

      document.body.style.cursor = "";
    };
  }, [
    RUN_CONFIG.dragRotateSpeedX,
    RUN_CONFIG.dragRotateSpeedY,
    RUN_CONFIG.maxDragTiltX,
    controlsRef,
    setCursor,
  ]);

  useFrame((state) => {
    const root = rootRef.current;
    const visual = visualRef.current;
    const anim = animRef.current;
    if (!root || !visual) return;

    const {
      totalFrames,
      moveStartFrame,
      baseX,
      baseY,
      baseZ,
      wrapPadding,
      dragFollowLerp,
      dragReturnLerp,
    } = RUN_CONFIG;

    let x = baseX;
    let z = baseZ;

    if (anim?.action && anim?.clip) {
      const clipDuration = anim.clip.duration;
      const actionTime = anim.action.time;
      const frameFloat = (actionTime / clipDuration) * totalFrames;

      if (frameFloat >= moveStartFrame) {
        const viewport = state.viewport.getCurrentViewport(
          state.camera,
          [0, 0, baseZ]
        );

        const rightX = viewport.width / 2 + wrapPadding;
        const leftX = -viewport.width / 2 - wrapPadding;

        const outDistance = Math.max(0.0001, rightX - baseX);
        const inDistance = Math.max(0.0001, baseX - leftX);
        const totalDistance = outDistance + inDistance;

        const moveFrameSpan = Math.max(1, totalFrames - moveStartFrame);
        const moveProgress = clamp01(
          (frameFloat - moveStartFrame) / moveFrameSpan
        );

        const split = outDistance / totalDistance;

        if (moveProgress < split) {
          const local = clamp01(moveProgress / split);

          // sai para a direita mantendo Z normal
          x = lerp(baseX, rightX, easeInCubic(local));
          z = baseZ;
        } else {
          const local = clamp01((moveProgress - split) / (1 - split));

          // reaparece na esquerda com Z mais fundo e volta para Z=0
          x = lerp(leftX, baseX, easeOutCubic(local));
          z = lerp(baseZ + RUN_CONFIG.reentryZOffset, baseZ, easeOutCubic(local));
        }
      }
    }

    root.position.set(x, baseY, z);
    root.visible = true;

    const drag = dragRef.current;

    if (!drag.active) {
      drag.targetRotX = lerp(drag.targetRotX, 0, dragReturnLerp);
      drag.targetRotY = lerp(drag.targetRotY, 0, dragReturnLerp);
    }

    drag.currentRotX = lerp(drag.currentRotX, drag.targetRotX, dragFollowLerp);
    drag.currentRotY = lerp(drag.currentRotY, drag.targetRotY, dragFollowLerp);

    visual.rotation.x = drag.currentRotX;
    visual.rotation.y = drag.currentRotY;
    visual.rotation.z = 0;
  });

  const interactiveHandlers = useMemo(
    () => ({
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUpOnMesh,
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
    }),
    [handlePointerDown, handlePointerUpOnMesh, handlePointerOver, handlePointerOut]
  );

  return (
    <group ref={rootRef}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.17, isMobile ? -1.08 : 0, 0.127]}
        scale={isMobile ? [1.15, 1, 0.95] : [1.45, 1, 1.16]}
        renderOrder={-1}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={shadowTexture}
          transparent
          opacity={3.8}
          depthWrite={false}
        />
      </mesh>

      <group ref={visualRef}>
        <BB8
          onAnimationReady={handleAnimationReady}
          interactiveHandlers={interactiveHandlers}
          scale={RUN_CONFIG.scale}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        />
      </group>
    </group>
  );
}

function Hero() {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const { t } = useTranslation();
  const controlsRef = useRef(null);
  const heroRef = useRef(null);
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

  const cameraSettings = isMobile
    ? { position: [0, 0.2, 6], fov: 34 }
    : { position: [0, 0.35, 5.9], fov: 32 };

  const orbitTarget = isMobile ? [0, -1.38, 0] : [0, -1.5, 0];

  return (
    <section ref={heroRef} className="hero" id="home">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__overlay" />
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
                ref={controlsRef}
                makeDefault
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                autoRotate={false}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={isMobile ? 0.85 : 0.75}
                minPolarAngle={Math.PI / 2.28}
                maxPolarAngle={Math.PI / 1.9}
                target={orbitTarget}
              />

              <Suspense fallback={null}>
                <ambientLight intensity={1.18} />

                <directionalLight
                  position={[6, 3, 1]}
                  intensity={1.30}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                  shadow-bias={-0.00008}
                  shadow-normalBias={0.02}
                  shadow-camera-near={0.5}
                  shadow-camera-far={20}
                  shadow-camera-left={-4}
                  shadow-camera-right={4}
                  shadow-camera-top={4}
                  shadow-camera-bottom={-4}
                />

                <BB8Runner isMobile={isMobile} controlsRef={controlsRef} />
              </Suspense>
            </Canvas>
          </div>
        </motion.figure>
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
              className="hero__title hero__title--stacked"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.55 }}
            >
              <span className="hero__line">{t("hero.titleLine1")}</span>
              <span className="hero__line">{t("hero.titleLine2")}</span>

              <span className="hero__line hero__line--word">
                <AnimatedWord />
              </span>

              <span className="hero__line hero__line--solution">
                <span className="hero__title-soft">{t("hero.titleLine4")}</span>
              </span>
            </motion.h1>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;