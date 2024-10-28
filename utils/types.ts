export type PullRequest = {
  title: string;
  number: number;
  state: string;
  created_at: string;
  html_url: string;
  repo: string;
  user: string;
};

export type PullRequestChange = {
  number: number;
  link: string;
  summary: string;
};

export type PullRequestSummary = {
  number: number;
  link: string;
  summary: string;
};

export type QualitativeSummary = {
  blockers: string;
  learnings: string;
  wins: string;
};

export type DailySummary = {
  prSummaries: PullRequestSummary[];
  qualitativeSummary: QualitativeSummary;
};
