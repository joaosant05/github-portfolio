import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";

// Three floors the drawing buffer dimensions but rounds the viewport. At
// fractional DPRs this can put the viewport one pixel outside the framebuffer.
export default function CanvasViewport() {
  const { gl, size, viewport, invalidate } = useThree();
  useLayoutEffect(() => {
    const dpr = gl.getPixelRatio();
    gl.setViewport(0, 0, gl.domElement.width / dpr, gl.domElement.height / dpr);
    invalidate();
  }, [gl, size.width, size.height, viewport.dpr, invalidate]);
  return null;
}
