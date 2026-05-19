const backgroundAssets = {
  dark: {
    desktop: "/assets/theme/desert.jpg",
    mobile: "/assets/theme/desert-mobile.jpg",
  },
  light: {
    desktop: "/assets/theme/dark.jpg",
    mobile: "/assets/theme/dark-mobile.jpg",
  },
};

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

export function preloadVisualAssets() {
  if (typeof window === "undefined") return Promise.resolve();

  if (!preloadPromise) {
    const savedTheme = window.localStorage?.getItem("theme");
    const theme = savedTheme === "light" ? "light" : "dark";
    const isMobile = window.matchMedia?.("(max-width: 853px)").matches;
    const viewportKey = isMobile ? "mobile" : "desktop";
    const currentBackground = backgroundAssets[theme][viewportKey];
    const followUpBackgrounds = Object.values(backgroundAssets)
      .map((entry) => entry[viewportKey])
      .filter((src) => src !== currentBackground);

    preloadPromise = new Promise((resolve) => {
      warmImageCache(currentBackground).finally(resolve);

      const warmFollowUps = () =>
        Promise.allSettled(followUpBackgrounds.map(warmImageCache));

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(warmFollowUps, { timeout: 1800 });
        return;
      }

      window.setTimeout(warmFollowUps, 700);
    });
  }

  return preloadPromise;
}
