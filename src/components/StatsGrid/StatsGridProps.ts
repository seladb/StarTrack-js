import RepoInfo from "../../utils/RepoInfo";

export type StatsData = Record<string, string | number>;

export interface RepoInfoWithStats extends Omit<RepoInfo, "stargazerData" | "forecast"> {
  stats: StatsData;
}

export default interface StatsGridProps {
  statInfos: Array<RepoInfoWithStats>;
}
