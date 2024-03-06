import * as utils from "./FileUtils";

describe(utils.downloadFile, () => {
  it("download file", async () => {
    const blobPropsMock = jest.fn();
    const revokeObjectURLMock = jest.fn();
    URL.createObjectURL = jest.fn().mockImplementationOnce((blob: Blob) => {
      blobPropsMock({ type: blob.type, contentSize: blob.size });
    });

    URL.revokeObjectURL = revokeObjectURLMock;
    const link = document.createElement("a");
    jest.spyOn(document, "createElement").mockReturnValueOnce(link);

    utils.downloadFile("my_file.json", "file content", "application/json");

    expect(link.download).toEqual("my_file.json");
    expect(blobPropsMock).toHaveBeenCalledWith({
      type: "application/json",
      contentSize: "file content".length,
    });
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});
