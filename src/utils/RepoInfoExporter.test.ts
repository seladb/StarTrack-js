import RepoInfo from "./RepoInfo";
import * as exporter from "./RepoInfoExporter";

const repoInfos: Array<RepoInfo> = [
  {
    username: "user1",
    repo: "repo1",
    color: {
      hex: "hexColor1",
      hsl: "stlColor1",
    },
    stargazerData: {
      timestamps: ["ts1", "ts2"],
      starCounts: [1, 2],
    },
  },
  {
    username: "user2",
    repo: "repo2",
    color: {
      hex: "hexColor2",
      hsl: "stlColor2",
    },
    stargazerData: {
      timestamps: ["ts1", "ts2"],
      starCounts: [1, 2],
    },
  },
];

const forecast = {
  timestamps: ["ts3", "ts4"],
  starCounts: [3, 4],
};

const repoInfosWithForecast = () => {
  return repoInfos.map((repoInfo) => {
    return {
      ...repoInfo,
      forecast: forecast,
    };
  });
};

describe(exporter.exportRepoInfosToJson, () => {
  const expectedRepoInfoAsJson = [
    {
      username: "user1",
      repo: "repo1",
      stargazerData: [
        { starCount: 1, starredAt: "ts1" },
        { starCount: 2, starredAt: "ts2" },
      ],
    },
    {
      username: "user2",
      repo: "repo2",
      stargazerData: [
        { starCount: 1, starredAt: "ts1" },
        { starCount: 2, starredAt: "ts2" },
      ],
    },
  ];

  const expectedForecastAsJson = [
    { starCount: 3, starredAt: "ts3" },
    { starCount: 4, starredAt: "ts4" },
  ];

  const expectedRepoInfoWithForecastAsJson = () => {
    return expectedRepoInfoAsJson.map((repoInfoAsJson) => {
      return {
        ...repoInfoAsJson,
        forecast: expectedForecastAsJson,
      };
    });
  };

  it("export single info without forecast", () => {
    const result = exporter.exportRepoInfosToJson(repoInfos.slice(0, 1));

    expect(result).toEqual(expectedRepoInfoAsJson[0]);
  });

  it("export multiple infos without forecast", () => {
    const result = exporter.exportRepoInfosToJson(repoInfos);

    expect(result).toEqual(expectedRepoInfoAsJson);
  });

  it("export single info with forecast", () => {
    const result = exporter.exportRepoInfosToJson(repoInfosWithForecast().slice(0, 1));

    expect(result).toEqual(expectedRepoInfoWithForecastAsJson()[0]);
  });

  it("export multiple infos with forecast", () => {
    const result = exporter.exportRepoInfosToJson(repoInfosWithForecast());

    expect(result).toEqual(expectedRepoInfoWithForecastAsJson());
  });
});

describe(exporter.exportRepoInfosToCsv, () => {
  const expectedRepoInfoAsCsv = [
    {
      name: "user1-repo1.csv",
      content: "Star Count,Starred At\n1,ts1\n2,ts2",
    },
    {
      name: "user2-repo2.csv",
      content: "Star Count,Starred At\n1,ts1\n2,ts2",
    },
  ];

  const expectedForecastAsCsv = "Star Count,Starred At\n3,ts3\n4,ts4";

  const expectedRepoInfoWithForecastAsCsv = [
    {
      name: "user1-repo1.csv",
      content: "Star Count,Starred At\n1,ts1\n2,ts2",
    },
    {
      name: "user1-repo1-forecast.csv",
      content: expectedForecastAsCsv,
    },
    {
      name: "user2-repo2.csv",
      content: "Star Count,Starred At\n1,ts1\n2,ts2",
    },
    {
      name: "user2-repo2-forecast.csv",
      content: expectedForecastAsCsv,
    },
  ];

  it("export infos without forecast", () => {
    const result = exporter.exportRepoInfosToCsv(repoInfos);

    expect(result).toEqual(expectedRepoInfoAsCsv);
  });

  it("export infos with forecast", () => {
    const result = exporter.exportRepoInfosToCsv(repoInfosWithForecast());

    expect(result).toEqual(expectedRepoInfoWithForecastAsCsv);
  });
});
