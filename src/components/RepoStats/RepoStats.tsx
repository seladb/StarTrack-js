import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Checkbox, FormControlLabel, Stack, Typography, useMediaQuery } from "@mui/material";
import RepoInfo from "../../utils/RepoInfo";
import * as stargazerStats from "../../utils/StargazerStats";
import StatsGridLargeScreen from "./StatsGridLargeScreen";
import StatsGridSmallScreen from "./StatsGridSmallScreen";
import DownloadData from "./DownloadData";

interface DateRange {
  username: string;
  repo: string;
  start: string;
  end: string;
}

interface RepoStatsProps {
  repoInfos: Array<RepoInfo>;
  dateRanges?: Array<DateRange>;
}

type StatsData = Record<string, string | number>;

interface RepoInfoWithStats extends RepoInfo {
  stats: StatsData;
}

export default function RepoStats({ repoInfos, dateRanges }: RepoStatsProps) {
  const [syncStatsToDisplayedDateRange, setSyncStatsToDisplayedDateRange] =
    React.useState<boolean>(false);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const repoInfosWithStats: Array<RepoInfoWithStats> = repoInfos.map((repoInfo) => {
    const dateRange = dateRanges?.find(
      (range) => range.username === repoInfo.username && range.repo === repoInfo.repo,
    );
    return {
      ...repoInfo,
      stats: stargazerStats.calcStats(
        repoInfo.stargazerData,
        syncStatsToDisplayedDateRange && dateRange
          ? { min: dateRange.start, max: dateRange.end }
          : undefined,
      ),
    };
  });

  const handleCheckBoxChange = (_: React.SyntheticEvent, checked: boolean) => {
    setSyncStatsToDisplayedDateRange(checked);
  };

  const StatsGridComponent = smallScreen ? StatsGridSmallScreen : StatsGridLargeScreen;

  const overallRange = dateRanges?.reduce<DateRange | null>((prev, current) => {
    const { start, end } = current;

    if (!prev) {
      return { username: "", repo: "", start, end };
    }

    return {
      repo: "",
      username: "",
      start: start < prev.start ? start : prev.start,
      end: end > prev.end ? end : prev.end,
    };
  }, null);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Repo Data and Statistics
      </Typography>
      <Box>
        <FormControlLabel
          control={<Checkbox />}
          label="Sync stats to chart zoom level"
          onChange={handleCheckBoxChange}
        />
        {syncStatsToDisplayedDateRange && overallRange && (
          <Typography>
            <b>Date range:</b> {new Date(overallRange.start).toLocaleDateString()} &rarr;{" "}
            {new Date(overallRange.end).toLocaleDateString()}
          </Typography>
        )}
      </Box>
      <StatsGridComponent statInfos={repoInfosWithStats} />
      <DownloadData repoInfos={repoInfos} />
    </Stack>
  );
}
