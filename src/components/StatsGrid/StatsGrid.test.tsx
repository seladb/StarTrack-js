import { render, screen, fireEvent } from "@testing-library/react";
import StatsGrid, { RenderRepoChip, slugify } from "./StatsGrid";
import * as gitHubUtils from "../../utils/GitHubUtils";
import * as stargazerStats from "../../utils/StargazerStats";
import RepoInfo from "../../utils/RepoInfo";

describe(RenderRepoChip, () => {
  let windowOpenMock: jest.SpyInstance;

  beforeEach(() => {
    windowOpenMock = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenMock.mockRestore();
  });

  it("render the chip correctly", () => {
    const row = {
      user: "user",
      repo: "repo",
      color: "red",
    };

    const repoUrl = "https://repo.org";

    const getRepoUrlMock = jest.spyOn(gitHubUtils, "getRepoUrl").mockReturnValue(repoUrl);

    render(<RenderRepoChip row={row} />);

    const chip = screen.getByText(`${row.user} / ${row.repo}`);
    expect(chip).toBeInTheDocument();

    expect(chip.parentElement?.style.backgroundColor).toBe(row.color);
    expect(chip.parentElement?.style.color).toBe("rgb(255, 255, 255)");

    fireEvent.click(chip);
    expect(getRepoUrlMock).toHaveBeenCalledWith(row.user, row.repo);
    expect(windowOpenMock).toHaveBeenCalledWith(repoUrl, "_blank", "noreferrer");
  });
});

describe(slugify, () => {
  it.each([
    ["slugified", "slugified"],
    ["with space", "with-space"],
    ["with  multiple   spaces", "with-multiple-spaces"],
    ["CapitalLetterS", "capitalletters"],
    ["!@special*&()chars$#", "specialchars"],
    ["multiple---dashes", "multiple-dashes"],
  ])("slugify correctly", (str: string, expected: string) => {
    expect(slugify(str)).toBe(expected);
  });
});

const mockDataGrid = jest.fn();
jest.mock("@mui/x-data-grid", () => ({
  __esModule: true,
  DataGrid: (props: unknown[]) => {
    mockDataGrid(props);
    return <div data-testid="datagrid" />;
  },
}));

describe(StatsGrid, () => {
  it("renders a grid with stats", () => {
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

    const stats = {
      "Stat 1": 1,
      "Stat 2": "2",
    };

    jest.spyOn(stargazerStats, "calcStats").mockReturnValue(stats);

    render(<StatsGrid repoInfos={repoInfos} />);

    const expectedColumns = [
      {
        field: "repo",
        headerName: "",
        sortable: false,
        width: 200,
        renderCell: RenderRepoChip,
      },
      {
        field: "stat-1",
        headerName: "Stat 1",
        sortable: true,
        width: 130,
        type: "number",
        align: "center",
      },
      {
        field: "stat-2",
        headerName: "Stat 2",
        sortable: true,
        width: 130,
        type: "string",
        align: "center",
      },
    ];

    const expectedRows = [
      {
        id: 0,
        user: repoInfos[0].username,
        repo: repoInfos[0].repo,
        color: repoInfos[0].color.hex,
        "stat-1": stats["Stat 1"],
        "stat-2": stats["Stat 2"],
      },
      {
        id: 1,
        user: repoInfos[1].username,
        repo: repoInfos[1].repo,
        color: repoInfos[1].color.hex,
        "stat-1": stats["Stat 1"],
        "stat-2": stats["Stat 2"],
      },
    ];

    expect(mockDataGrid).toHaveBeenCalledWith({
      autoPageSize: true,
      columns: expectedColumns,
      rows: expectedRows,
      sx: {
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "break-spaces",
          lineHeight: "normal",
          textAlign: "center",
        },
      },
    });

    expect(screen.getByTestId("datagrid").parentElement).toHaveStyle({
      height: `${120 + 60 * repoInfos.length}px`,
    });
  });
});
