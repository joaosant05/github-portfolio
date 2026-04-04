import { getDevStats } from "./devStats";

export async function getLeetCodeStats() {
  const stats = await getDevStats();

  return {
    updatedAt: stats?.updatedAt ?? null,
    username: stats?.leetcode?.username ?? "joaosant05",
    totalSolved: stats?.leetcode?.totalSolved ?? 0,
    easySolved: stats?.leetcode?.easySolved ?? 0,
    mediumSolved: stats?.leetcode?.mediumSolved ?? 0,
    hardSolved: stats?.leetcode?.hardSolved ?? 0,
  };
}