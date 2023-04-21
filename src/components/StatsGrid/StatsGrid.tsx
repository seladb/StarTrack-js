import { Chip, Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import RepoInfo from "../../utils/RepoInfo";
import * as stargazerStats from "../../utils/StargazerStats";
import * as gitHubUtils from "../../utils/GitHubUtils";

interface RenderRepoChipProps {
  row: {
    user: string;
    repo: string;
    color: string;
  };
}

export function RenderRepoChip({ row }: RenderRepoChipProps) {
  const handleClick = () => {
    const url = gitHubUtils.getRepoUrl(row.user, row.repo);
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <Chip
      label={`${row.user} / ${row.repo}`}
      style={{ backgroundColor: row.color, color: "#ffffff" }}
      clickable={true}
      onClick={handleClick}
    />
  );
}

export const slugify = (str: string) => {
  str = str
    .replace(/[^A-Za-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .toLowerCase();
  return str;
};

type DateRange = {
  min: string;
  max: string;
};

interface StatsGridProps {
  repoInfos: Array<RepoInfo>;
  dateRange?: DateRange;
}

type StatsData = Record<string, string | number>;

interface RepoInfoWithStats extends RepoInfo {
  stats: StatsData;
}

export default function StatsGrid({ repoInfos, dateRange }: StatsGridProps) {
  const repoInfosWithStats: Array<RepoInfoWithStats> = repoInfos.map((repoInfo) => {
    return {
      ...repoInfo,
      stats: stargazerStats.calcStats(repoInfo.stargazerData, dateRange),
    };
  });

  const buildColumns = (stats: StatsData): Array<GridColDef> => {
    const columnsFromData = Object.entries(stats).map(([columnName, exampleValue]): GridColDef => {
      return {
        field: slugify(columnName),
        headerName: columnName,
        sortable: true,
        width: 130,
        type: typeof exampleValue,
        align: "center",
      };
    });

    return [
      {
        field: "repo",
        headerName: "",
        sortable: false,
        width: 200,
        renderCell: RenderRepoChip,
      },
      ...columnsFromData,
    ];
  };

  const buildRows = (repoInfosWithStats: Array<RepoInfoWithStats>) => {
    return repoInfosWithStats.map((repoInfoWithStats, index) => {
      const row: StatsData = {};

      Object.entries(repoInfoWithStats.stats).forEach(([columnName, rowValue]) => {
        row[slugify(columnName)] = rowValue;
      });

      return {
        id: index,
        user: repoInfoWithStats.username,
        repo: repoInfoWithStats.repo,
        color: repoInfoWithStats.color.hex,
        ...row,
      };
    });
  };

  const gridHeight = 120 + repoInfos.length * 60;

  return (
    <Container sx={{ height: gridHeight }}>
      <DataGrid
        rows={buildRows(repoInfosWithStats)}
        columns={buildColumns(repoInfosWithStats[0].stats)}
        autoPageSize={true}
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "break-spaces",
            lineHeight: "normal",
            textAlign: "center",
          },
        }}
      />
    </Container>
  );
}
