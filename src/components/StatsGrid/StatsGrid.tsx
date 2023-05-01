import React from "react";
import { Box, Checkbox, Chip, FormControlLabel } from "@mui/material";
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
  const [syncStatsToDisplayedDateRange, setSyncStatsToDisplayedDateRange] =
    React.useState<boolean>(false);

  const repoInfosWithStats: Array<RepoInfoWithStats> = repoInfos.map((repoInfo) => {
    return {
      ...repoInfo,
      stats: stargazerStats.calcStats(
        repoInfo.stargazerData,
        syncStatsToDisplayedDateRange ? dateRange : undefined,
      ),
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

  const handleCheckBoxChange = (_: React.SyntheticEvent, checked: boolean) => {
    setSyncStatsToDisplayedDateRange(checked);
  };

  const gridHeight = 120 + repoInfos.length * 60;

  return (
    <Box sx={{ paddingLeft: 0, paddingRight: 0 }}>
      <h1>Repo Statistics</h1>
      <Box sx={{ marginBottom: "20px" }}>
        <FormControlLabel
          control={<Checkbox />}
          label="Sync stats to chart zoom level"
          onChange={handleCheckBoxChange}
        />
        {syncStatsToDisplayedDateRange && dateRange && (
          <>
            <p style={{ marginTop: 5 }}>
              <b>Date range:</b>{" "}
              <Chip label={new Date(dateRange.min).toLocaleDateString()} variant="outlined"></Chip>{" "}
              -{" "}
              <Chip label={new Date(dateRange.max).toLocaleDateString()} variant="outlined"></Chip>
            </p>
          </>
        )}
      </Box>
      <DataGrid
        rows={buildRows(repoInfosWithStats)}
        columns={buildColumns(repoInfosWithStats[0].stats)}
        autoPageSize={true}
        sx={{
          height: gridHeight,
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "break-spaces",
            lineHeight: "normal",
            textAlign: "center",
          },
        }}
      />
    </Box>
  );
}
