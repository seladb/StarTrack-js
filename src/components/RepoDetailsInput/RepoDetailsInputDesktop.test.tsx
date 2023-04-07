import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RepoDetailsInputDesktop from "./RepoDetailsInputDesktop";

const goClickHandler = jest.fn();
const cancelClickHandler = jest.fn();

const username = "user";
const repo = "repo";

describe(RepoDetailsInputDesktop, () => {
  it("Renders correctly on non-loading state and fires an event on Go click", () => {
    render(
      <RepoDetailsInputDesktop
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    );

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");
    fireEvent.change(usernameTextBox, { target: { value: username } });
    fireEvent.change(repoTextBox, { target: { value: repo } });

    const goBtn = screen.getByRole("button");
    fireEvent.click(goBtn);

    expect(goClickHandler).toBeCalledWith(username, repo);
    expect(cancelClickHandler).not.toBeCalled();
  });

  it.each(["repoTextBox", "usernameTextBox"])(
    "Renders correctly on non-loading state and fires an event on Enter key",
    (textbox) => {
      render(
        <RepoDetailsInputDesktop
          loading={false}
          onGoClick={goClickHandler}
          onCancelClick={cancelClickHandler}
        />,
      );

      const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");
      fireEvent.change(usernameTextBox, { target: { value: username } });
      fireEvent.change(repoTextBox, { target: { value: repo } });

      if (textbox == "repoTextBox") {
        userEvent.type(repoTextBox, "{Enter}");
      } else {
        userEvent.type(usernameTextBox, "{Enter}");
      }

      expect(goClickHandler).toBeCalledWith(username, repo);
      expect(cancelClickHandler).not.toBeCalled();
    },
  );

  it("Renders correctly in loading state and fires an event on Cancel click", () => {
    render(
      <RepoDetailsInputDesktop
        loading={true}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    );

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");
    fireEvent.change(usernameTextBox, { target: { value: username } });
    fireEvent.change(repoTextBox, { target: { value: repo } });

    const [loadingBtn, cancelBtn] = screen.getAllByRole("button");

    expect(loadingBtn.textContent).toStrictEqual("Loading...");

    fireEvent.click(cancelBtn);

    expect(goClickHandler).not.toBeCalled();
    expect(cancelClickHandler).toBeCalled();
  });

  it("Trims the username and repo", () => {
    render(
      <RepoDetailsInputDesktop
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    );

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");
    fireEvent.change(usernameTextBox, { target: { value: `   ${username}   ` } });
    fireEvent.change(repoTextBox, { target: { value: ` ${repo}  ` } });

    const goBtn = screen.getByRole("button");
    fireEvent.click(goBtn);

    expect(goClickHandler).toBeCalledWith(username, repo);
  });

  it("Renders a tooltip when hovering on repo details", async () => {
    render(
      <RepoDetailsInputDesktop
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    );

    const repoDetails = screen.getByText("Repo details");
    userEvent.hover(repoDetails);

    const toolTip = await screen.findByRole("tooltip");
    expect(toolTip).toBeInTheDocument();
  });

  it.each([
    ["username", "https://github.com/seladb/pcapplusplus", "seladb", "pcapplusplus"],
    ["repo", "https://github.com/seladb/pcapplusplus", "seladb", "pcapplusplus"],
    ["username", "https://google.com", "", ""],
    ["repo", "https://google.com", "", ""],
  ])(
    "Parses pasted GitHub URL",
    (whereToPaste, pasted, expectedValueInUserBox, expectedValueInRepoBox) => {
      render(
        <RepoDetailsInputDesktop
          loading={false}
          onGoClick={goClickHandler}
          onCancelClick={cancelClickHandler}
        />,
      );

      const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");
      const boxToPaste = whereToPaste === "username" ? usernameTextBox : repoTextBox;
      fireEvent.paste(boxToPaste, { clipboardData: { getData: () => pasted } });

      expect(usernameTextBox).toHaveValue(expectedValueInUserBox);
      expect(repoTextBox).toHaveValue(expectedValueInRepoBox);
    },
  );
});
