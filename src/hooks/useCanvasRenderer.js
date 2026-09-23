import { useCallback, useState } from "react";
import { WebGLRenderer } from "three";

export function useCanvasRenderer(lowPower) {
  const [error, setError] = useState(null);
  const createRenderer = useCallback((defaults) => {
    try {
      return new WebGLRenderer({
        ...defaults,
        alpha: true,
        antialias: !lowPower,
        powerPreference: lowPower ? "low-power" : "default",
        preserveDrawingBuffer: false,
      });
    } catch (failure) {
      // Fiber configures async renderers outside the React error boundary.
      // Re-throw in render so the boundary can show the existing fallback.
      setError(failure);
      // Prevent that abandoned configuration from continuing with an invalid GL.
      // No timer/resource is attached; unmount releases the pending configuration.
      return new Promise(() => {});
    }
  }, [lowPower]);
  if (error) throw error;
  return createRenderer;
}
