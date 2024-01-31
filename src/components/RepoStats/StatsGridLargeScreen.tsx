import { DataGrid, GridColDef } from "@mui/x-data-grid";
import StatsGridProps, { RepoInfoWithStats, StatsData } from "./StatsGridProps";
import { slugify } from "../../utils/StringUtils";
import RepoChip from "./RepoChip";

interface RenderRepoChipProps {
  row: {
    user: string;
    repo: string;
    color: string;
  };
}

export function RenderRepoChip({ row }: RenderRepoChipProps) {
  return <RepoChip user={row.user} repo={row.repo} color={row.color} />;
}

export default function StatsGridLargeScreen({ statInfos }: StatsGridProps) {
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

  return (
    <DataGrid
      rows={buildRows(statInfos)}
      columns={buildColumns(statInfos[0].stats)}
      autoHeight={true}
      pageSizeOptions={[]}
      sx={{
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "break-spaces",
          lineHeight: "normal",
          textAlign: "center",
        },
      }}
    />
  );
}
