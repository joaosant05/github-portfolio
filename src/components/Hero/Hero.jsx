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
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import "./Hero.css";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
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

function BB8({ onAnimationReady, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/bb8.glb");
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const clip = animations?.[0];
    const action = clip ? actions?.[clip.name] : null;

    if (!clip || !action) return;

    action.reset();
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(1);
    action.play();

    onAnimationReady?.({
      action,
      clip,
      mixer,
    });
  }, [actions, animations, mixer, onAnimationReady]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.694}
        >
          <group
            name="3924ee77ba9a46c58a2abc9fdcf9971cfbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="BB8BB8" scale={0.004}>
                  <group name="BB8Center_NeutralPose" position={[0, 62, 0]}>
                    <group name="BB8Center">
                      <group name="BB8BB8_Body">
                        <mesh
                          name="BB8BB8_Body_Scene_Material_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Body_Scene_Material_0.geometry}
                          material={materials.Scene_Material}
                        />
                        <mesh
                          name="BB8BB8_Body_Scene_Material_0_1"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Body_Scene_Material_0_1.geometry}
                          material={materials.Scene_Material}
                        />
                      </group>
                      <group name="BB8Hatch_Door">
                        <mesh
                          name="BB8Hatch_Door_Scene_Material_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8Hatch_Door_Scene_Material_0.geometry}
                          material={materials.Scene_Material}
                        />
                      </group>
                    </group>
                  </group>
                  <group name="BB8Center_Head_NeutralPose" position={[0, 62, 0]}>
                    <group name="BB8Center_Head">
                      <group name="BB8Antena">
                        <mesh
                          name="BB8Antena_Scene_Material1_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8Antena_Scene_Material1_0.geometry}
                          material={materials.Scene_Material1}
                        />
                      </group>
                      <group name="BB8BB8_Head">
                        <mesh
                          name="BB8BB8_Head_Scene_Material1_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Head_Scene_Material1_0.geometry}
                          material={materials.Scene_Material1}
                        />
                        <mesh
                          name="BB8BB8_Head_Scene_Material1_0_1"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Head_Scene_Material1_0_1.geometry}
                          material={materials.Scene_Material1}
                        />
                      </group>
                      <group name="BB8Eye">
                        <mesh
                          name="BB8Eye_Eye_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8Eye_Eye_0.geometry}
                          material={materials.material}
                        />
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/bb8.glb");

function BB8Runner({ isMobile, debugConfig = {} }) {
  const groupRef = useRef(null);
  const animRef = useRef(null);

  const RUN_CONFIG = useMemo(() => {
    const defaults = {
      totalFrames: 299,
      moveStartFrame: 230,
      baseX: isMobile ? -0.9 : 1.3,
      baseY: isMobile ? -1.82 : -2.8,
      baseZ: 0,
      wrapPadding: isMobile ? 0.52 : 0.68,
      snapToWholeFrame: false,
    };

    return { ...defaults, ...debugConfig };
  }, [isMobile, debugConfig]);

  const handleAnimationReady = useCallback((data) => {
    animRef.current = data;
    console.log("BB8 clip duration:", data.clip.duration);
    console.log("BB8 clip name:", data.clip.name);
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    const anim = animRef.current;

    if (!group) return;

    const {
      totalFrames,
      moveStartFrame,
      baseX,
      baseY,
      baseZ,
      wrapPadding,
      snapToWholeFrame,
    } = RUN_CONFIG;

    let x = baseX;

    if (anim?.action && anim?.clip) {
      const clipDuration = anim.clip.duration;
      const actionTime = anim.action.time;

      const rawFrameFloat = (actionTime / clipDuration) * totalFrames;
      const frameFloat = snapToWholeFrame
        ? Math.floor(rawFrameFloat)
        : rawFrameFloat;

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
          const eased = easeInCubic(local);
          x = lerp(baseX, rightX, eased);
        } else {
          const local = clamp01((moveProgress - split) / (1 - split));
          const eased = easeOutCubic(local);
          x = lerp(leftX, baseX, eased);
        }
      }
    }

    group.visible = true;
    group.position.set(x, baseY, baseZ);
    group.rotation.set(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <BB8
        onAnimationReady={handleAnimationReady}
        scale={isMobile ? 0.09 : 5}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

function DebugSlider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
}) {
  const isInteger = step >= 1;
  const displayValue = isInteger
    ? Math.round(value)
    : Number(value).toFixed(String(step).split(".")[1]?.length ?? 2);

  return (
    <label className="hero-debug__field">
      <div className="hero-debug__top">
        <span>{label}</span>
        <strong>{displayValue}</strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function HeroDebugPanel({ values, setValues }) {
  const update = (key, value) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "totalFrames") {
        const safeTotalFrames = Math.max(2, Math.round(value));
        next.totalFrames = safeTotalFrames;
        next.moveStartFrame = Math.min(next.moveStartFrame, safeTotalFrames - 1);
      }

      if (key === "moveStartFrame") {
        next.moveStartFrame = Math.min(
          Math.max(0, Math.round(value)),
          Math.max(1, Math.round(next.totalFrames) - 1)
        );
      }

      return next;
    });
  };

  const safeTotalFrames = Math.max(2, Math.round(values.totalFrames));
  const safeMoveStartFrame = Math.min(
    Math.max(0, Math.round(values.moveStartFrame)),
    safeTotalFrames - 1
  );

  return (
    <aside className="hero-debug">
      <h3 className="hero-debug__title">BB8 Debug</h3>

      <DebugSlider
        label="totalFrames"
        value={values.totalFrames}
        min={60}
        max={400}
        step={1}
        onChange={(v) => update("totalFrames", v)}
      />

      <DebugSlider
        label="moveStartFrame"
        value={values.moveStartFrame}
        min={0}
        max={Math.max(1, values.totalFrames - 1)}
        step={1}
        onChange={(v) => update("moveStartFrame", v)}
      />

      <DebugSlider
        label="baseX"
        value={values.baseX}
        min={-8}
        max={4}
        step={0.1}
        onChange={(v) => update("baseX", v)}
      />

      <DebugSlider
        label="baseY"
        value={values.baseY}
        min={-4}
        max={1}
        step={0.05}
        onChange={(v) => update("baseY", v)}
      />

      <DebugSlider
        label="wrapPadding"
        value={values.wrapPadding}
        min={0.1}
        max={1.5}
        step={0.01}
        onChange={(v) => update("wrapPadding", v)}
      />

      <label className="hero-debug__field hero-debug__field--toggle">
        <div className="hero-debug__top">
          <span>snapToWholeFrame</span>
          <strong>{values.snapToWholeFrame ? "ON" : "OFF"}</strong>
        </div>

        <input
          type="checkbox"
          checked={values.snapToWholeFrame}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              snapToWholeFrame: e.target.checked,
            }))
          }
        />
      </label>
    </aside>
  );
}

function Hero() {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const { t } = useTranslation();

  const [debugValues, setDebugValues] = useState({
    totalFrames: 299,
    moveStartFrame: 230,
    baseX: 1.3,
    baseY: -2.8,
    wrapPadding: 0.68,
    snapToWholeFrame: false,
  });

  useEffect(() => {
    setDebugValues({
      totalFrames: 299,
      moveStartFrame: 230,
      baseX: isMobile ? -0.9 : 1.3,
      baseY: isMobile ? -1.82 : -2.8,
      wrapPadding: isMobile ? 0.52 : 0.68,
      snapToWholeFrame: false,
    });
  }, [isMobile]);

  const cameraSettings = isMobile
    ? { position: [0, 0.2, 6], fov: 34 }
    : { position: [0, 0.35, 5.9], fov: 32 };

  const orbitTarget = isMobile ? [0, -1.38, 0] : [0, -1.5, 0];

  return (
    <section className="hero" id="home">
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
                makeDefault
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                autoRotate={false}
                enableDamping
                dampingFactor={0.08}
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

                <BB8Runner
                  isMobile={isMobile}
                  debugConfig={debugValues}
                />
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
            />
          </motion.div>
        </div>
      </div>

      <HeroDebugPanel values={debugValues} setValues={setDebugValues} />
    </section>
  );
}

export default Hero;