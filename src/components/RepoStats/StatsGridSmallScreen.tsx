import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Stack,
} from "@mui/material";
import StatsGridProps from "./StatsGridProps";
import { slugify } from "../../utils/StringUtils";
import RepoChip from "./RepoChip";

export default function StatsGridSmallScreen({ statInfos }: StatsGridProps) {
  return (
    <Stack spacing={2}>
      {statInfos.map((statInfo) => {
        return (
          <TableContainer key={`${statInfo.username}/${statInfo.repo}`} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <RepoChip
                      user={statInfo.username}
                      repo={statInfo.repo}
                      color={statInfo.color.hex}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(statInfo.stats).map(([statName, statValue]) => (
                  <TableRow key={slugify(statName)}>
                    <TableCell>{statName}</TableCell>
                    <TableCell>{statValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </Stack>
  );
}
