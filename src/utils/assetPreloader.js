const backgroundAssets = {
  dark: {
    desktop: "/assets/theme/desert.jpg",
    mobile: "/assets/theme/desert-mobile.jpg",
  },
};

let preloadPromise;

function warmImageCache(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.fetchPriority = "high";
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;

    if (image.decode) {
      image.decode().then(resolve).catch(resolve);
    }
  });
}

export function preloadVisualAssets() {
  if (typeof window === "undefined") return Promise.resolve();

  if (!preloadPromise) {
    const savedTheme = window.localStorage?.getItem("theme");
    // The light theme has no background image. Avoid requests for missing files.
    if (savedTheme === "light") return Promise.resolve();
    const isMobile = window.matchMedia?.("(max-width: 853px)").matches;
    const viewportKey = isMobile ? "mobile" : "desktop";
    preloadPromise = warmImageCache(backgroundAssets.dark[viewportKey]);
  }

  return preloadPromise;
}
