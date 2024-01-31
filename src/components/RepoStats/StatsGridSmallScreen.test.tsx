import { render, screen, within } from "@testing-library/react";
import StatsGridSmallScreen from "./StatsGridSmallScreen";

const mockRepoChip = jest.fn();

jest.mock("./RepoChip", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoChip(props);
    return <>RepoChip</>;
  },
}));

describe(StatsGridSmallScreen, () => {
  const statInfos = [
    {
      username: "user1",
      repo: "repo1",
      color: { hsl: "color1hsl", hex: "color1hex" },
      stats: {
        "Stat 1": 1,
        "Stat 2": "1",
      },
    },
    {
      username: "user2",
      repo: "repo2",
      color: { hsl: "color2hsl", hex: "color2hex" },
      stats: {
        "Stat 1": 2,
        "Stat 2": "2",
      },
    },
  ];

  it.each([[statInfos], [statInfos.slice(0, 1)]])("render tables", (statInfosInput) => {
    render(<StatsGridSmallScreen statInfos={statInfosInput} />);

    const tables = screen.getAllByRole("table");
    statInfosInput.forEach((statInfo, index) => {
      const table = tables[index];

      expect(within(table).getByRole("columnheader")).toHaveTextContent("RepoChip");
      expect(mockRepoChip).toHaveBeenCalledWith({
        user: statInfo.username,
        repo: statInfo.repo,
        color: statInfo.color.hex,
      });

      const rows = within(table).getAllByRole("row").slice(1);

      expect(rows.length).toEqual(Object.keys(statInfo.stats).length);

      Object.entries(statInfo.stats).forEach((statKeyValue, index) => {
        const row = rows[index];
        expect(row.childNodes[0]).toHaveTextContent(statKeyValue[0]);
        expect(row.childNodes[1]).toHaveTextContent(String(statKeyValue[1]));
      });
    });
  });
});
