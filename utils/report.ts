import { getPullRequestDiff, getUserPRsForToday } from "./github";
import {
  getPullRequestDiffSummary,
  getPullRequestManyBlockers,
  getPullRequestManyLearnings,
  getPullRequestManyWins,
} from "./openai";
import type { DailySummary, PullRequest, PullRequestSummary, QualitativeSummary } from "./types";

// Get pull request summaries
async function getPullRequestSummaries(prs: PullRequest[]): Promise<PullRequestSummary[]> {
  const prSummaries: PullRequestSummary[] = await Promise.all(
    prs.map(async (pr) => {
      const diff = await getPullRequestDiff(pr.user, pr.repo, pr.number);
      const summary = await getPullRequestDiffSummary(diff);

      return {
        number: pr.number,
        link: `https://www.github.com/${pr.user}/${pr.repo}/pull/${pr.number}`,
        summary: summary,
      };
    })
  );

  return prSummaries.sort((a, b) => (a.number || 0) - (b.number || 0));
}

// Get qualitative summaries
async function getQualitativeSummary(prs: PullRequest[]): Promise<QualitativeSummary> {
  const prChanges: string[] = await Promise.all(
    prs.map((pr) => getPullRequestDiff(pr.user, pr.repo, pr.number))
  );
  const prChangesConcat = prChanges.join("\n");

  // send to OpenAI and get: blockers
  const blockers = await getPullRequestManyBlockers(prChangesConcat);

  // send to OpenAI and get: learnings
  const learnings = await getPullRequestManyLearnings(prChangesConcat);

  // send to OpenAI and get: wins
  const wins = await getPullRequestManyWins(prChangesConcat);

  const qualitativeSummary: QualitativeSummary = {
    blockers: blockers,
    learnings: learnings,
    wins: wins,
  };

  return qualitativeSummary;
}

// Get daily summary
async function getDailySummary(username: string): Promise<DailySummary> {
  // Get pull requests
  const prs: PullRequest[] = await getUserPRsForToday(username);

  // Get pull request summaries
  const prSummaries: PullRequestSummary[] = await getPullRequestSummaries(prs);

  // Get qualitative summary
  const qualitativeSummary = await getQualitativeSummary(prs);

  const dailySummary: DailySummary = {
    qualitativeSummary: qualitativeSummary,
    prSummaries: prSummaries,
  };

  return dailySummary;
}

function formatSlackEODReport(dailySummary: DailySummary): string {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}`;

  let report = `EOD Status Report ${dateStr}\n`;

  // Add Blockers section
  report += `Blockers\n`;
  if (dailySummary.qualitativeSummary.blockers) {
    report += `-${dailySummary.qualitativeSummary.blockers}\n`;
  }

  // Add Learning section
  report += `Learning\n`;
  if (dailySummary.qualitativeSummary.learnings) {
    report += `-${dailySummary.qualitativeSummary.learnings}\n`;
  }

  // Add Wins section
  report += `Wins\n`;
  if (dailySummary.qualitativeSummary.wins) {
    report += `-${dailySummary.qualitativeSummary.wins}\n`;
  }

  // Add PRs section with links
  report += `PRs\n`;
  for (const pr of dailySummary.prSummaries) {
    report += `-PR${pr.number}: ${pr.link}: ${pr.summary}\n`;
  }

  return report;
}

export async function getEODReport(username: string): Promise<string> {
  const dailySummary = await getDailySummary(username);
  const dailySummaryFormatted = formatSlackEODReport(dailySummary);
  return dailySummaryFormatted;
}
