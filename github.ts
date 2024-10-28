import axios from "axios";
import type { PullRequest } from "./types";

function getRepoName(repositoryUrl: string): string {
  return repositoryUrl.split("/").pop() || "";
}

// Get pull requests for the day
export async function getUserPRsForToday(username: string): Promise<PullRequest[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().split("T")[0];

  const url = `https://api.github.com/search/issues`;
  const query = `q=author:${username}+is:pr+created:${todayISO}`;

  const res = await axios({
    method: "GET",
    url: `${url}?${query}`,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const data: PullRequest[] = res.data.items.map((pr: any) => ({
    title: pr.title,
    number: pr.number,
    state: pr.state,
    created_at: pr.created_at,
    html_url: pr.html_url,
    repo: getRepoName(pr.repository_url),
    user: pr.user.login,
  }));

  return data;
}

// Get pull request code differences
export async function getPullRequestDiff(
  owner: string,
  repo: string,
  number: number
): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`;

  const res = await axios({
    method: "GET",
    url: url,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3.diff",
    },
  });

  const data: string = res.data;
  return data;
}
