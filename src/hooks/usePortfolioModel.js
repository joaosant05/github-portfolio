import { useGLTF } from "@react-three/drei";

export function usePortfolioModel(path) {
  // These GLBs use standard glTF buffers, without Draco or Meshopt extensions.
  // Avoid initializing unused WASM decoders (and their Firefox source-map warnings).
  return useGLTF(path, false, false);
}
