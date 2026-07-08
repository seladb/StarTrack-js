import { startGitHubMockServer } from "./gitHubMockServer.ts";

const port = Number(process.env.MOCK_SERVER_PORT) || 4010;

startGitHubMockServer(port).then(() => {
  console.log(`GitHub mock server listening on port ${port}`);
});
