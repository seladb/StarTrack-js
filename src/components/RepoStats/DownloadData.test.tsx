import { screen, render, fireEvent } from "@testing-library/react";
import DownloadData from "./DownloadData";
import RepoInfo from "../../utils/RepoInfo";

const mockDownloadFile = jest.fn();
const mockZipAndDownloadFiles = jest.fn();

jest.mock("../../utils/FileUtils", () => ({
  downloadFile: (fileName: string, fileContent: string, contentType: string) => {
    mockDownloadFile(fileName, fileContent, contentType);
  },
  zipAndDownloadFiles: (files: unknown[], zipFileName: string) => {
    mockZipAndDownloadFiles(files, zipFileName);
  },
}));

const mockExportRepoInfosToJson = jest.fn();
const mockExportRepoInfosToCsv = jest.fn();

jest.mock("../../utils/RepoInfoExporter", () => ({
  exportRepoInfosToJson: (repoInfos: Array<RepoInfo>) => {
    mockExportRepoInfosToJson(repoInfos);
    return { key1: "value1", key2: "value2" };
  },
  exportRepoInfosToCsv: (repoInfos: Array<RepoInfo>) => {
    return mockExportRepoInfosToCsv(repoInfos);
  },
}));

const repoInfos: Array<RepoInfo> = [
  {
    username: "user1",
    repo: "repo1",
    color: {
      hex: "hexColor1",
      hsl: "stlColor1",
    },
    stargazerData: {
      timestamps: ["ts1", "ts2"],
      starCounts: [1, 2],
    },
  },
  {
    username: "user2",
    repo: "repo2",
    color: {
      hex: "hexColor2",
      hsl: "stlColor2",
    },
    stargazerData: {
      timestamps: ["ts1", "ts2"],
      starCounts: [1, 2],
    },
  },
];

describe(DownloadData, () => {
  it("download json", () => {
    render(<DownloadData repoInfos={repoInfos} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockExportRepoInfosToJson).toHaveBeenCalledWith(repoInfos);
    expect(mockExportRepoInfosToCsv).not.toHaveBeenCalled();

    expect(mockDownloadFile).toHaveBeenCalledWith(
      "StargazerData.json",
      // eslint-disable-next-line quotes
      '{\n  "key1": "value1",\n  "key2": "value2"\n}',
      "application/json",
    );
    expect(mockZipAndDownloadFiles).not.toHaveBeenCalled();
  });

  it("download single csv", () => {
    mockExportRepoInfosToCsv.mockImplementationOnce(() => {
      return [
        {
          name: "file1.csv",
          content: "content",
        },
      ];
    });

    render(<DownloadData repoInfos={repoInfos} />);

    const csv = screen.getByLabelText("CSV") as HTMLInputElement;
    fireEvent.click(csv);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockExportRepoInfosToJson).not.toHaveBeenCalled();
    expect(mockExportRepoInfosToCsv).toHaveBeenCalledWith(repoInfos);

    expect(mockDownloadFile).toHaveBeenCalledWith("file1.csv", "content", "text/csv");
    expect(mockZipAndDownloadFiles).not.toHaveBeenCalled();
  });

  it("download multiple csv", () => {
    const files = [
      {
        name: "file1.csv",
        content: "content",
      },
      {
        name: "file2.csv",
        content: "content",
      },
    ];

    mockExportRepoInfosToCsv.mockImplementationOnce(() => files);

    render(<DownloadData repoInfos={repoInfos} />);

    const csv = screen.getByLabelText("CSV") as HTMLInputElement;
    fireEvent.click(csv);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockExportRepoInfosToJson).not.toHaveBeenCalled();
    expect(mockExportRepoInfosToCsv).toHaveBeenCalledWith(repoInfos);

    expect(mockDownloadFile).not.toHaveBeenCalled();
    expect(mockZipAndDownloadFiles).toHaveBeenCalledWith(files, "StargazerData.zip");
  });
});
