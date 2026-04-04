const STATS_FILE_PATH = `${import.meta.env.BASE_URL}data/dev-stats.json`;

let statsPromise = null;

async function loadStats() {
  const response = await fetch(`${STATS_FILE_PATH}?v=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load dev stats JSON.");
  }

  return response.json();
}

export async function getDevStats(forceRefresh = false) {
  if (!statsPromise || forceRefresh) {
    statsPromise = loadStats();
  }

  return statsPromise;
}