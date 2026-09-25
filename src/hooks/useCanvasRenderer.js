import { useCallback, useState } from "react";
import { WebGLRenderer } from "three";

export function useCanvasRenderer(lowPower) {
  const [error, setError] = useState(null);
  const createRenderer = useCallback((defaults) => {
    try {
      const renderer = new WebGLRenderer({
        ...defaults,
        alpha: true,
        antialias: !lowPower,
        powerPreference: lowPower ? "low-power" : "default",
        preserveDrawingBuffer: false,
      });
      // Avoid synchronous shader log round trips in production (Firefox profile).
      // Full diagnostics remain available during development.
      renderer.debug.checkShaderErrors = import.meta.env.DEV;
      return renderer;
    } catch (failure) {
      // Fiber configures async renderers outside the React error boundary.
      // Re-throw in render so the boundary can handle the failed attempt.
      setError(failure);
      // Prevent that abandoned configuration from continuing with an invalid GL.
      // No timer/resource is attached; unmount releases the pending configuration.
      return new Promise(() => {});
    }
  }, [lowPower]);
  if (error) throw error;
  return createRenderer;
}
