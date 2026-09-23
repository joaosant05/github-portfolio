// Pure policy: respond to sustained slow frames, not one shader compile/download.
export function createRenderQuality({ maxDpr = 1.25, fps = 60 } = {}) {
  return { dpr: maxDpr, maxDpr, fps, maxFps: fps, slow: 0, fast: 0, changes: 0, direction: null, flips: 0 };
}

export function sampleRenderQuality(quality, measuredFps) {
  const slow = measuredFps < quality.fps * 0.78 ? quality.slow + 1 : 0;
  const fast = measuredFps >= quality.fps * 0.94 ? quality.fast + 1 : 0;
  const next = { ...quality, slow, fast };
  const minDpr = Math.min(0.5, quality.maxDpr);
  if (slow >= 2) {
    if (quality.dpr > minDpr) next.dpr = Math.max(minDpr, +(quality.dpr - 0.2).toFixed(2));
    else next.fps = Math.max(20, quality.fps > 30 ? 30 : 20);
  } else if (fast >= 6 && quality.flips < 4) {
    // Hysteresis and a recovery limit prevent quality bouncing on borderline PCs.
    if (quality.fps < quality.maxFps) next.fps = quality.maxFps;
    else next.dpr = Math.min(quality.maxDpr, +(quality.dpr + 0.1).toFixed(2));
  }
  if (next.dpr !== quality.dpr || next.fps !== quality.fps) {
    next.slow = 0;
    next.fast = 0;
    next.changes += 1;
    const direction = slow >= 2 ? "down" : "up";
    if (quality.direction && quality.direction !== direction) next.flips += 1;
    next.direction = direction;
  }
  return next;
}

export function cappedDpr(width, height, preferredDpr) {
  // Bound fill cost on 1440p/4K screens, independent of OS zoom/device hints.
  return Math.min(preferredDpr, Math.sqrt(1_500_000 / Math.max(1, width * height)));
}
