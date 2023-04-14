import { render, screen, fireEvent, within } from "@testing-library/react";
import RepoChipContainer from "./RepoChipContainer";

describe(RepoChipContainer, () => {
  it("renders the chip container", () => {
    const onDelete = jest.fn();

    const reposDetails = [
      {
        user: "user1",
        repo: "repo1",
        color: "red",
      },
      {
        user: "user2",
        repo: "repo2",
        color: "green",
      },
      {
        user: "user3",
        repo: "repo3",
        color: "blue",
      },
    ];

    render(<RepoChipContainer reposDetails={reposDetails} onDelete={onDelete} />);

    reposDetails.forEach(({ user, repo }) => {
      const chip = screen.getByText(`${user} / ${repo}`);
      expect(chip).toBeInTheDocument();
    });

    const chip2 = screen.getByText("user2 / repo2");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const chip2DeleteIcon = within(chip2.parentElement!).getByTestId("CancelIcon");
    fireEvent.click(chip2DeleteIcon);

    expect(onDelete).toHaveBeenCalledWith("user2", "repo2");
  });
});
