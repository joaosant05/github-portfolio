const backgroundAssets = [
  "/assets/theme/desert.jpg",
  "/assets/theme/dark.jpg",
];

const modelAssets = [
  "/models/bb8.glb",
  "/models/react_icon.glb",
  "/models/javascript_icon.glb",
  "/models/typescript_icon.glb",
  "/models/python_icon.glb",
  "/models/fastapi_icon.glb",
  "/models/java_icon.glb",
  "/models/csharp_icon.glb",
  "/models/mysql_icon.glb",
  "/models/git_icon.glb",
  "/models/docker_icon.glb",
  "/models/devops_icon.glb",
  "/models/digitalocean_icon.glb",
  "/models/figma_icon.glb",
  "/models/illustrator_icon.glb",
];

let preloadPromise;

function warmImageCache(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;

    if (image.decode) {
      image.decode().then(resolve).catch(resolve);
    }
  });
}

function warmFetchCache(src) {
  if (!window.fetch) return Promise.resolve();

  return fetch(src, {
    cache: "force-cache",
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) return undefined;
      return response.arrayBuffer();
    })
    .catch(() => undefined);
}

export function preloadVisualAssets() {
  if (typeof window === "undefined") return Promise.resolve();

  if (!preloadPromise) {
    const run = () =>
      Promise.allSettled([
        ...backgroundAssets.map(warmImageCache),
        ...modelAssets.map(warmFetchCache),
      ]);

    preloadPromise = new Promise((resolve) => {
      const start = () => run().then(resolve);

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(start, { timeout: 1200 });
        return;
      }

      window.setTimeout(start, 250);
    });
  }

  return preloadPromise;
}
