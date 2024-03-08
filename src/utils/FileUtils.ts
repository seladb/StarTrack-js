import { downloadZip } from "client-zip";
import * as FileUtils from "./FileUtils";

export const downloadFileFromBlob = (fileName: string, blob: Blob) => {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const anchorEl = document.createElement("a");
    anchorEl.href = objectUrl;
    anchorEl.download = fileName;
    anchorEl.click();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const downloadFile = (fileName: string, fileContent: string, contentType: string) => {
  const blob = new Blob([fileContent], { type: contentType });
  return FileUtils.downloadFileFromBlob(fileName, blob);
};

type FileInfo = {
  name: string;
  content: string;
};

export const zipAndDownloadFiles = async (files: Array<FileInfo>, zipFileName: string) => {
  const fileInfos = files.map(({ name, content }) => {
    return {
      name: name,
      input: content,
    };
  });

  const blob = await downloadZip(fileInfos).blob();
  FileUtils.downloadFileFromBlob(zipFileName, blob);
};
