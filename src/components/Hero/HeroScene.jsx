import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BB8 } from "../models/BB8";
import RenderLoop from "../models/RenderLoop";
import CanvasViewport from "../models/CanvasViewport";
import CanvasHealth from "../models/CanvasHealth";
import { canvasEvents } from "../../utils/canvasEvents";
import { useCanvasRenderer } from "../../hooks/useCanvasRenderer";
import PreparedModel from "../models/PreparedModel";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInCubic = (t) => t * t * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function BB8Runner({
  isMobile,
  lowPower,
  disableModelInteraction = false,
  attempt,
  shouldReduceMotion,
}) {
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
      baseX: isMobile ? 0.54 : 1.3,
      baseY: isMobile ? -1.05 : -2.34,
      baseZ: isMobile ? 0 : -0.5,
      reentryZOffset: -1.3,
      wrapPadding: isMobile ? 0.78 : 0.68,
      scale: isMobile ? 1.7 : 2.2,
      dragRotateSpeedX: 0.0035,
      dragRotateSpeedY: 0.0085,
      maxDragTiltX: 0.35,
      dragFollowLerp: 0.18,
      dragReturnLerp: 0.08,
    }),
    [isMobile],
  );
  const modelPath = (lowPower ? "/models/bb8-mobile.glb" : "/models/bb8.glb") + (attempt ? `?retry=${attempt}` : "");

  const setCursor = useCallback((value) => {
    document.body.style.cursor = value;
  }, []);

  const handleAnimationReady = useCallback(
    (data) => {
      animRef.current = data;
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      e.stopPropagation();
      e.target.setPointerCapture?.(e.pointerId);

      dragRef.current.active = true;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;

      setCursor("grabbing");
    },
    [setCursor],
  );

  const handlePointerUpOnMesh = useCallback(
    (e) => {
      e.stopPropagation();
      e.target.releasePointerCapture?.(e.pointerId);

      const drag = dragRef.current;
      drag.active = false;
      drag.pointerId = null;

      setCursor(drag.hovered ? "grab" : "");
    },
    [setCursor],
  );

  const handlePointerOver = useCallback(
    (e) => {
      e.stopPropagation();
      dragRef.current.hovered = true;
      if (!dragRef.current.active) setCursor("grab");
    },
    [setCursor],
  );

  const handlePointerOut = useCallback(
    (e) => {
      e.stopPropagation();
      dragRef.current.hovered = false;
      if (!dragRef.current.active) setCursor("");
    },
    [setCursor],
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
      size / 2,
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

  useEffect(() => () => shadowTexture.dispose(), [shadowTexture]);

  useEffect(() => {
    if (!visualRef.current) return;

    visualRef.current.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
  }, []);

  useEffect(() => {
    if (disableModelInteraction) return;

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
        RUN_CONFIG.maxDragTiltX,
      );
    };

    const handleWindowPointerUp = () => {
      const drag = dragRef.current;
      if (!drag.active) return;

      drag.active = false;
      drag.pointerId = null;

      setCursor(drag.hovered ? "grab" : "");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);

      document.body.style.cursor = "";
    };
  }, [
    RUN_CONFIG.dragRotateSpeedX,
    RUN_CONFIG.dragRotateSpeedY,
    RUN_CONFIG.maxDragTiltX,
    disableModelInteraction,
    setCursor,
  ]);

  useFrame((state, delta) => {
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

    if (!shouldReduceMotion && anim?.action && anim?.clip) {
      const clipDuration = anim.clip.duration;
      const actionTime = anim.action.time;
      const frameFloat = (actionTime / clipDuration) * totalFrames;

      if (frameFloat >= moveStartFrame) {
        const viewport = state.viewport.getCurrentViewport(state.camera, [
          0,
          0,
          baseZ,
        ]);

        const rightX = viewport.width / 2 + wrapPadding;
        const leftX = -viewport.width / 2 - wrapPadding;

        const outDistance = Math.max(0.0001, rightX - baseX);
        const inDistance = Math.max(0.0001, baseX - leftX);
        const totalDistance = outDistance + inDistance;

        const moveFrameSpan = Math.max(1, totalFrames - moveStartFrame);
        const moveProgress = clamp01(
          (frameFloat - moveStartFrame) / moveFrameSpan,
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
          z = lerp(
            baseZ + RUN_CONFIG.reentryZOffset,
            baseZ,
            easeOutCubic(local),
          );
        }
      }
    }

    root.position.set(x, baseY, z);
    root.visible = true;

    const drag = dragRef.current;
    const returnFactor =
      1 - Math.pow(1 - dragReturnLerp, Math.min(delta, 0.05) * 60);
    const followFactor =
      1 - Math.pow(1 - dragFollowLerp, Math.min(delta, 0.05) * 60);

    if (!drag.active) {
      drag.targetRotX = lerp(drag.targetRotX, 0, returnFactor);
      drag.targetRotY = lerp(drag.targetRotY, 0, returnFactor);
    }

    drag.currentRotX = lerp(drag.currentRotX, drag.targetRotX, followFactor);
    drag.currentRotY = lerp(drag.currentRotY, drag.targetRotY, followFactor);

    visual.rotation.x = drag.currentRotX;
    visual.rotation.y = drag.currentRotY;
    visual.rotation.z = 0;
  });

  const interactiveHandlers = useMemo(() => {
    if (disableModelInteraction) return {};

    return {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUpOnMesh,
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
    };
  }, [
    disableModelInteraction,
    handlePointerDown,
    handlePointerUpOnMesh,
    handlePointerOver,
    handlePointerOut,
  ]);

  return (
    <group ref={rootRef}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.18, isMobile ? 0.04 : 0, 0.127]}
        scale={isMobile ? [1.45, 1, 0.84] : [1.45, 1, 1.16]}
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
          modelPath={modelPath}
          shouldReduceMotion={shouldReduceMotion}
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

// Preserve the original framing without mounting controls that capture touch gestures.
function CameraTarget({ isMobile }) {
  const { camera, invalidate } = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0, isMobile ? -0.9 : -1.5, 0);
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, invalidate, isMobile]);
  return null;
}

export default function HeroScene({
  isMobile,
  lowPower,
  disableModelInteraction,
  shouldReduceMotion,
  onReady,
  onError,
  attempt = 0,
}) {
  const [useLightModel, setUseLightModel] = useState(false);
  const createRenderer = useCanvasRenderer(lowPower);
  const handlePressure = useCallback(() => {
    startTransition(() => setUseLightModel(true));
  }, []);
  return (
    <Canvas
      events={canvasEvents}
      resize={{ offsetSize: true }}
      camera={
        isMobile
          ? { position: [0, 0.18, 5.25], fov: 31 }
          : { position: [0, 0.35, 5.9], fov: 32 }
      }
      frameloop="demand"
      dpr={lowPower ? 1 : [1, 1.25]}
      gl={createRenderer}
      style={{
        pointerEvents: disableModelInteraction ? "none" : "auto",
        touchAction: "pan-y pinch-zoom",
      }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <CanvasViewport />
      <CanvasHealth onError={onError} />
      <RenderLoop
        active={!shouldReduceMotion}
        fps={lowPower ? 30 : 60}
        scrollFps={30}
        lowPower={lowPower}
        onPressure={handlePressure}
      />
      <CameraTarget isMobile={isMobile} />
      <ambientLight intensity={1.18} />
      <directionalLight position={[6, 3, 1]} intensity={1.3} />
      <Suspense fallback={null}>
        <PreparedModel key={`${lowPower || useLightModel}-${attempt}`} onReady={onReady} onError={onError}>
          <BB8Runner
            isMobile={isMobile}
            lowPower={lowPower || useLightModel}
            disableModelInteraction={disableModelInteraction || shouldReduceMotion}
            shouldReduceMotion={shouldReduceMotion}
            attempt={attempt}
          />
        </PreparedModel>
      </Suspense>
    </Canvas>
  );
}
