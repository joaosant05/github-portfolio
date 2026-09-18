import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Demand rendering lets hidden/static scenes sleep, and avoids running at
// 120/144 fps on high-refresh screens. Controls can still invalidate on input.
export default function RenderLoop({ active, fps = 60 }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (!active) return;
    const timer = window.setInterval(invalidate, 1000 / fps);
    return () => window.clearInterval(timer);
  }, [active, fps, invalidate]);

  return null;
}
