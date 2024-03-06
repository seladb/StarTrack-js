export const downloadFile = (fileName: string, fileContent: string, contentType: string) => {
  const blob = new Blob([fileContent], { type: contentType });
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
