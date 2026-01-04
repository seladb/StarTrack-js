import * as utils from "./FileUtils";
import { vi } from "vitest";

const mockDownloadZip = jest.fn();

vi.mock("client-zip", () => ({
  downloadZip: (props: unknown[]) => {
    mockDownloadZip(props);
    return new Response();
  },
}));

describe(utils.downloadFileFromBlob, () => {
  it("download file", async () => {
    const blobPropsMock = jest.fn();
    const revokeObjectURLMock = jest.fn();
    URL.createObjectURL = jest.fn().mockImplementationOnce((props: unknown[]) => {
      blobPropsMock(props);
      return "url";
    });
    URL.revokeObjectURL = revokeObjectURLMock;

    const link = document.createElement("a");
    jest.spyOn(document, "createElement").mockReturnValueOnce(link);

    const blob = new Blob(["file content"], { type: "text/plain" });
    utils.downloadFileFromBlob("my_file.json", blob);

    expect(link.download).toEqual("my_file.json");
    expect(blobPropsMock).toHaveBeenCalledWith(blob);
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});

describe(utils.downloadFile, () => {
  it("download file", () => {
    const downloadFileFromBlobMock = jest.fn();
    jest.spyOn(utils, "downloadFileFromBlob").mockImplementationOnce((fileName, blob: Blob) => {
      downloadFileFromBlobMock({ type: blob.type, contentSize: blob.size, fileName: fileName });
    });

    utils.downloadFile("my_file.json", "file content", "text/plain");

    expect(downloadFileFromBlobMock).toHaveBeenCalledWith({
      type: "text/plain",
      contentSize: "file content".length,
      fileName: "my_file.json",
    });
  });
});

describe(utils.zipAndDownloadFiles, () => {
  it("zip and download files", async () => {
    const mockDownloadFileFromBlob = jest.spyOn(utils, "downloadFileFromBlob").mockImplementation();

    const files = [
      {
        name: "file1.txt",
        content: "file1 content",
      },
      {
        name: "file2.txt",
        content: "file2 content",
      },
    ];

    const expectedDownloadZipInput = [
      {
        name: "file1.txt",
        input: "file1 content",
      },
      {
        name: "file2.txt",
        input: "file2 content",
      },
    ];

    await utils.zipAndDownloadFiles(files, "zipped.zip");
    expect(mockDownloadZip).toHaveBeenCalledWith(expectedDownloadZipInput);
    expect(mockDownloadFileFromBlob).toHaveBeenCalled();
  });
});
