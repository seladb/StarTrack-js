import StarData from "./StarData";

export default interface RepoInfo {
  username: string;
  repo: string;
  color: string;
  stargazerData: StarData;
  stats: { [stat: string]: number | string };
  forecast?: StarData | null;
}
