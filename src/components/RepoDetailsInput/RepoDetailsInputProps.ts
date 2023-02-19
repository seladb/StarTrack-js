export default interface RepoDetailsInputProps {
  loading: boolean;
  onGoClick: (username: string, repo: string) => void;
  onCancelClick: () => void;
}
