import http, { type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface HarEntry {
  request: {
    method: string;
    url: string;
  };
  response: {
    status: number;
    headers?: Array<{
      name: string;
      value: string;
    }>;
    content: {
      text: string;
    };
  };
}

export const startGitHubMockServer = (port: number): Promise<Server> => {
  const harPath = path.join(__dirname, "githubApi.har");
  const har = JSON.parse(fs.readFileSync(harPath, "utf-8"));
  const entries: HarEntry[] = har.log.entries;

  const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url ?? "", `http://localhost:${port}`);
    const path = requestUrl.pathname + requestUrl.search;

    console.log(`>> ${req.method} ${path}`);
    console.log(`   headers: ${JSON.stringify(req.headers)}`);

    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept");

    if (req.method === "OPTIONS") {
      console.log(`<< 204 (preflight) ${path}`);
      res.writeHead(204);
      return res.end();
    }

    const match = entries.find((e) => {
      const entryUrl = new URL(e.request.url);
      return e.request.method === req.method && entryUrl.pathname + entryUrl.search === path;
    });

    if (!match) {
      console.log(`<< 404 (no HAR match) ${path}`);
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Not found in mock" }));
    }

    console.log(`<< ${match.response.status} ${path}`);
    console.log(`   body: ${match.response.content.text}`);

    match.response.headers?.forEach(({ name, value }) => {
      const lower = name.toLowerCase();

      if (lower === "content-encoding") {
        return;
      }

      res.setHeader(name, value);
    });

    console.log(`   body: ${match.response.content.text}`);
    res.writeHead(match.response.status);
    res.end(match.response.content.text);
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
};
