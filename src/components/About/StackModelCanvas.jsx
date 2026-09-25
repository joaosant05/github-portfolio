import { Suspense, lazy, memo, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box3, Vector3, MathUtils } from "three";
import { OrbitControls } from "@react-three/drei";
import RenderLoop from "../models/RenderLoop";
import CanvasViewport from "../models/CanvasViewport";
import CanvasHealth from "../models/CanvasHealth";
import ModelErrorBoundary from "./ModelErrorBoundary";
import { usePerformanceProfile } from "../../hooks/usePerformanceProfile";
import { useCanvasRenderer } from "../../hooks/useCanvasRenderer";
import PreparedModel from "../models/PreparedModel";

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

function FloatingModel({ item, viewer, ModelComponent, reduceMotion = false, isMobile }) {
  const fitRef = useRef(null);
  const rootRef = useRef(null);
  const spinRef = useRef(null);
  const StackLogo = ModelComponent;
  const { camera, size, invalidate } = useThree();

  const basePosition = useMemo(
    () => viewer.position ?? [0, -0.12, 0],
    [viewer.position]
  );

  const baseRotation = useMemo(
    () => viewer.rotation ?? [0.08, 0.35, 0],
    [viewer.rotation]
  );

  useLayoutEffect(() => {
    const fit = fitRef.current;
    const root = rootRef.current;
    if (!fit || !root) return;

    fit.scale.setScalar(1);
    fit.position.set(0, 0, 0);
    fit.updateWorldMatrix(true, true);

    if (isMobile && size.width > 0 && size.height > 0) {
      // Measure once on mount/resize, not on animation frames. Each asset has
      // different units and an off-center origin, so a shared multiplier fails.
      const bounds = new Box3().setFromObject(root);
      if (!bounds.isEmpty()) {
        const center = bounds.getCenter(new Vector3());
        camera.updateMatrixWorld();
        const extent = bounds.clone().applyMatrix4(camera.matrixWorldInverse)
          .getSize(new Vector3());
        const target = new Vector3(...(viewer.target ?? basePosition));
        const distance = camera.position.distanceTo(target);
        const vertical = Math.tan(MathUtils.degToRad(camera.getEffectiveFOV()) / 2);
        const horizontal = vertical * size.width / size.height;
        const fill = 0.78;
        const requiredDistance = extent.z / 2 + Math.max(
          extent.x / (2 * horizontal * fill),
          extent.y / (2 * vertical * fill),
        );
        if (requiredDistance > 0) {
          const scale = distance / requiredDistance;
          fit.scale.setScalar(scale);
          fit.position.copy(target).addScaledVector(center, -scale);
        }
      }
    }
    invalidate();
  }, [isMobile, size.width, size.height, camera, viewer.target, basePosition, invalidate]);

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
    <group ref={fitRef}>
      <group ref={rootRef} position={basePosition} rotation={baseRotation}>
        <group ref={spinRef}>
          <StackLogo
            scale={(viewer.scale ?? 1.08) * (isMobile ? 1 : viewer.desktopScaleMultiplier ?? 1)}
          />
        </group>
      </group>
    </group>
  );
}

const StackModelCanvas = memo(function StackModelCanvas({
  item,
  reduceMotion,
  isInteractive = true,
  animateModel = true,
  lowPower = false,
  onReady,
  onError,
  failed,
}) {
  const { isMobile } = usePerformanceProfile();
  const createRenderer = useCanvasRenderer(lowPower);
  const ModelComponent =
    logoRegistry[normalizeLogoKey(item.modelKey || item.name)];

  const viewer = item.viewer || {};

  if (!ModelComponent) {
    return null;
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
        resize={{ offsetSize: true }}
        dpr={lowPower ? 1 : [1, 1.25]}
        shadows={false}
        frameloop="demand"
        camera={{
          position: viewer.cameraPosition || [0, 0, 4.2],
          fov: viewer.fov || 34,
          near: viewer.near ?? 0.01,
          far: viewer.far ?? 100,
        }}
        gl={createRenderer}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <CanvasViewport />
        <CanvasHealth onError={onError} />
        <RenderLoop active={animateModel && !failed && !reduceMotion} fps={30} lowPower={lowPower} />
        <ambientLight intensity={1.08} />
        <directionalLight position={[3.2, 3.2, 4]} intensity={1.6} />
        <directionalLight position={[-3, -2, 3]} intensity={0.72} />

        {!failed && <ModelErrorBoundary key={item.name} onError={onError}>
        <Suspense fallback={null}>
          <PreparedModel key={item.name} onReady={onReady} onError={onError}>
            <FloatingModel
              item={item}
              viewer={viewer}
              ModelComponent={ModelComponent}
              isMobile={isMobile}
              reduceMotion={reduceMotion || !animateModel}
            />
          </PreparedModel>

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
        </ModelErrorBoundary>}
      </Canvas>
    </div>
  );
});


export default StackModelCanvas;
