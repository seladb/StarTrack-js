import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Checkbox, FormControlLabel, Stack, Typography, useMediaQuery } from "@mui/material";
import RepoInfo from "../../utils/RepoInfo";
import * as stargazerStats from "../../utils/StargazerStats";
import StatsGridLargeScreen from "./StatsGridLargeScreen";
import StatsGridSmallScreen from "./StatsGridSmallScreen";

type DateRange = {
  min: string;
  max: string;
};

interface RepoStatsProps {
  repoInfos: Array<RepoInfo>;
  dateRange?: DateRange;
}

type StatsData = Record<string, string | number>;

interface RepoInfoWithStats extends RepoInfo {
  stats: StatsData;
}

export default function RepoStats({ repoInfos, dateRange }: RepoStatsProps) {
  const [syncStatsToDisplayedDateRange, setSyncStatsToDisplayedDateRange] =
    React.useState<boolean>(false);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const repoInfosWithStats: Array<RepoInfoWithStats> = repoInfos.map((repoInfo) => {
    return {
      ...repoInfo,
      stats: stargazerStats.calcStats(
        repoInfo.stargazerData,
        syncStatsToDisplayedDateRange ? dateRange : undefined,
      ),
    };
  });

  const handleCheckBoxChange = (_: React.SyntheticEvent, checked: boolean) => {
    setSyncStatsToDisplayedDateRange(checked);
  };

  const StatsGridComponent = smallScreen ? StatsGridSmallScreen : StatsGridLargeScreen;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Repo Statistics
      </Typography>
      <Box>
        <FormControlLabel
          control={<Checkbox />}
          label="Sync stats to chart zoom level"
          onChange={handleCheckBoxChange}
        />
        {syncStatsToDisplayedDateRange && dateRange && (
          <Typography>
            <b>Date range:</b> {new Date(dateRange.min).toLocaleDateString()} &rarr;{" "}
            {new Date(dateRange.max).toLocaleDateString()}
          </Typography>
        )}
      </Box>
      <StatsGridComponent statInfos={repoInfosWithStats} />
    </Stack>
  );
}
