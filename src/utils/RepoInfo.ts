import StarData from "./StarData";

export default interface RepoInfo {
  username: string;
  repo: string;
  color: { hsl: string; hex: string };
  stargazerData: StarData;
  forecast?: StarData;
}
