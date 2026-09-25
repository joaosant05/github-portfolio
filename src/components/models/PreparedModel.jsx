import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// Mount inside Suspense so preparation starts only after all model assets exist.
export default function PreparedModel({ children, onReady, onError }) {
  const group = useRef(null);
  const prepared = useRef(false);
  const readyFrame = useRef(0);
  const reported = useRef(false);
  const { gl, scene, camera, invalidate } = useThree();
  useLayoutEffect(() => {
    const object = group.current;
    let cancelled = false;
    object.visible = false;
    prepared.current = reported.current = false;
    // Compile with the final scene lights before the model's first visible frame.
    gl.compileAsync(object, camera, scene).then(() => {
      const context = gl.getContext();
      if (cancelled || context.isContextLost()) return;
      // Check failure once compilation has completed, without fetching shader logs.
      if (gl.info.programs.some(({ program }) => !context.getProgramParameter(program, context.LINK_STATUS))) {
        onError?.();
        return;
      }
      object.visible = true;
      prepared.current = true;
      invalidate();
    }).catch(() => { if (!cancelled) onError?.(); });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(readyFrame.current);
    };
  }, [gl, scene, camera, invalidate, onError]);

  useFrame(() => {
    if (!prepared.current || reported.current) return;
    reported.current = true;
    readyFrame.current = window.requestAnimationFrame(() => onReady?.());
  });
  return <group ref={group} visible={false}>{children}</group>;
}
