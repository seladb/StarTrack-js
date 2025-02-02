import React from "react";
import { Button, RadioGroup, FormControlLabel, Radio, Stack } from "@mui/material";
import RepoInfo from "../../utils/RepoInfo";
import { exportRepoInfosToCsv, exportRepoInfosToJson } from "../../utils/RepoInfoExporter";
import { downloadFile, zipAndDownloadFiles } from "../../utils/FileUtils";

const defaultFileName = "StargazerData";

interface DownloadDataProps {
  repoInfos: Array<RepoInfo>;
}

export default function DownloadData({ repoInfos }: DownloadDataProps) {
  const [fileFormat, setFileFormat] = React.useState<"json" | "csv">("json");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileFormat((event.target as HTMLInputElement).value as "json" | "csv");
  };

  const downloadJson = () => {
    const dataAsJson = exportRepoInfosToJson(repoInfos);
    downloadFile(
      `${defaultFileName}.json`,
      JSON.stringify(dataAsJson, null, 2),
      "application/json",
    );
  };

  const downloadCsv = async () => {
    const files = exportRepoInfosToCsv(repoInfos);
    if (files.length === 1) {
      downloadFile(files[0].name, files[0].content, "text/csv");
    } else {
      await zipAndDownloadFiles(files, `${defaultFileName}.zip`);
    }
  };

  const downloadData = async () => (fileFormat === "csv" ? await downloadCsv() : downloadJson());

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={downloadData}>
        Download data
      </Button>
      <RadioGroup row value={fileFormat} onChange={handleChange}>
        <FormControlLabel value="json" control={<Radio />} label="JSON" />
        <FormControlLabel value="csv" control={<Radio />} label="CSV" />
      </RadioGroup>
    </Stack>
  );
}
