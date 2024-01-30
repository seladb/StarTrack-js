import { render } from "@testing-library/react";
import StatsGridLargeScreen, { RenderRepoChip } from "./StatsGridLargeScreen";

const mockRepoChip = jest.fn();

jest.mock("./RepoChip", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoChip(props);
    return <>RepoChip</>;
  },
}));

const mockDataGrid = jest.fn();
jest.mock("@mui/x-data-grid", () => ({
  __esModule: true,
  DataGrid: (props: unknown[]) => {
    mockDataGrid(props);
    return <div data-testid="datagrid" />;
  },
}));

describe(RenderRepoChip, () => {
  it("render the chip correctly", () => {
    const row = {
      user: "user",
      repo: "repo",
      color: "red",
    };

    render(<RenderRepoChip row={row} />);

    expect(mockRepoChip).toHaveBeenCalledWith({ user: row.user, repo: row.repo, color: row.color });
  });
});

describe(StatsGridLargeScreen, () => {
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

  it("render the stats datagrid", () => {
    render(<StatsGridLargeScreen statInfos={statInfos} />);

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
        user: statInfos[0].username,
        repo: statInfos[0].repo,
        color: statInfos[0].color.hex,
        "stat-1": statInfos[0].stats["Stat 1"],
        "stat-2": statInfos[0].stats["Stat 2"],
      },
      {
        id: 1,
        user: statInfos[1].username,
        repo: statInfos[1].repo,
        color: statInfos[1].color.hex,
        "stat-1": statInfos[1].stats["Stat 1"],
        "stat-2": statInfos[1].stats["Stat 2"],
      },
    ];

    expect(mockDataGrid).toHaveBeenCalledWith({
      columns: expectedColumns,
      rows: expectedRows,
      autoHeight: true,
      pageSizeOptions: [],
      sx: {
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "break-spaces",
          lineHeight: "normal",
          textAlign: "center",
        },
      },
    });
  });
});
