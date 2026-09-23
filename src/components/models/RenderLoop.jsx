import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { cappedDpr, createRenderQuality, sampleRenderQuality } from "../../utils/renderQuality";

// Demand rendering lets hidden/static scenes sleep, and avoids running at
// 120/144 fps on high-refresh screens. Controls can still invalidate on input.
export default function RenderLoop({ active, fps = 60, lowPower = false, onPressure }) {
  const { invalidate, gl, setDpr, size } = useThree();
  const frames = useRef(0);
  const savedQuality = useRef(null);
  useFrame(() => { frames.current += 1; });

  useEffect(() => {
    const canvas = gl.domElement;
    const maxDpr = cappedDpr(size.width, size.height, Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.25));
    const previous = savedQuality.current;
    let quality = previous?.maxFps === fps
      ? { ...previous, dpr: Math.min(previous.dpr, maxDpr), maxDpr, slow: 0, fast: 0 }
      : createRenderQuality({ maxDpr, fps });
    savedQuality.current = quality;
    setDpr(quality.dpr);
    let pressureReported = false;
    let visible = false;
    let raf = 0;
    let lastTick = 0;
    let sampleStart = 0;
    let sampleFrames = 0;
    let warmupUntil = 0;

    const tick = (now) => {
      raf = window.requestAnimationFrame(tick);
      const interval = 1000 / quality.fps;
      if (now - lastTick >= interval - 1) {
        // Avoid accumulating requests or catch-up frames after a slow render.
        lastTick = now - (Math.max(0, now - lastTick - interval) % interval);
        invalidate();
      }
      if (now >= warmupUntil && now - sampleStart >= 1500) {
        const measured = (frames.current - sampleFrames) * 1000 / (now - sampleStart);
        const next = sampleRenderQuality(quality, measured);
        if (!pressureReported && next.dpr <= 0.7 && quality.slow >= 1 && measured < quality.fps * 0.78) {
          pressureReported = true;
          onPressure?.();
        }
        if (next.dpr !== quality.dpr) setDpr(next.dpr);
        quality = next;
        savedQuality.current = quality;
        sampleStart = now;
        sampleFrames = frames.current;
        if (import.meta.env.DEV) {
          canvas.setAttribute("data-render-fps", measured.toFixed(1));
          canvas.setAttribute("data-render-dpr", quality.dpr.toFixed(2));
          canvas.setAttribute("data-render-frames", String(frames.current));
        }
      }
    };
    const sync = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
      const running = active && visible && !document.hidden;
      if (import.meta.env.DEV) canvas.setAttribute("data-render-active", String(running));
      if (!running) return;
      lastTick = sampleStart = performance.now();
      sampleFrames = frames.current;
      warmupUntil = sampleStart + 3000;
      quality.slow = quality.fast = 0;
      invalidate();
      raf = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (visible === entry.isIntersecting) return;
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [active, fps, gl, invalidate, lowPower, onPressure, setDpr, size.width, size.height]);

  return null;
}
