import { getDevStats } from "./devStats";

export async function getGithubLastYearCommits() {
  const stats = await getDevStats();

  return {
    updatedAt: stats?.updatedAt ?? null,
    username: stats?.github?.username ?? "joaosant05",
    totalCommits: stats?.github?.totalCommits ?? 0,
    from: stats?.github?.from ?? null,
    to: stats?.github?.to ?? null,
  };
}