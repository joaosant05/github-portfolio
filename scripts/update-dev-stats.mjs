import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "public", "data");
const outputFile = path.join(outputDir, "dev-stats.json");

const CONFIG = {
  githubUsername: "joaosant05",
  leetcodeUsername: "joaosant05",
};

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const GITHUB_QUERY = `
  query GetGithubLastYearCommits(
    $username: String!,
    $from: DateTime!,
    $to: DateTime!
  ) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
      }
    }
  }
`;

const LEETCODE_QUERY = `
  query GetLeetCodeStats($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;

function getLastYearRange() {
  const to = new Date();
  const from = new Date(to);

  from.setFullYear(from.getFullYear() - 1);

  return {
    fromIso: from.toISOString(),
    toIso: to.toISOString(),
  };
}

function getDifficultyCount(items, difficulty) {
  return items.find((item) => item.difficulty === difficulty)?.count ?? 0;
}

async function fetchGitHubStats(username) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("Missing GITHUB_TOKEN in workflow environment.");
  }

  const { fromIso, toIso } = getLastYearRange();

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({
      query: GITHUB_QUERY,
      variables: {
        username,
        from: fromIso,
        to: toIso,
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    throw new Error(
      payload?.errors?.[0]?.message || "Failed to fetch GitHub stats."
    );
  }

  return {
    username,
    totalCommits:
      payload?.data?.user?.contributionsCollection?.totalCommitContributions ?? 0,
    from: fromIso,
    to: toIso,
  };
}

async function fetchLeetCodeStats(username) {
  const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "portfolio-stats-updater",
    },
    body: JSON.stringify({
      query: LEETCODE_QUERY,
      variables: {
        username,
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    throw new Error(
      payload?.errors?.[0]?.message || "Failed to fetch LeetCode stats."
    );
  }

  const entries =
    payload?.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];

  return {
    username,
    totalSolved: getDifficultyCount(entries, "All"),
    easySolved: getDifficultyCount(entries, "Easy"),
    mediumSolved: getDifficultyCount(entries, "Medium"),
    hardSolved: getDifficultyCount(entries, "Hard"),
  };
}

async function main() {
  const [github, leetcode] = await Promise.all([
    fetchGitHubStats(CONFIG.githubUsername),
    fetchLeetCodeStats(CONFIG.leetcodeUsername),
  ]);

  const output = {
    updatedAt: new Date().toISOString(),
    github,
    leetcode,
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log("Updated dev stats JSON:", outputFile);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});