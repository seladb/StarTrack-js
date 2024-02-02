import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RepoDetailsInputDesktop from "./RepoDetailsInputDesktop";

const goClickHandler = jest.fn();
const cancelClickHandler = jest.fn();

const username = "user";
const repo = "repo";

describe(RepoDetailsInputDesktop, () => {
  it("render correctly on non-loading state and fires an event on Go click", () => {
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

    expect(goClickHandler).toHaveBeenCalledWith(username, repo);
    expect(cancelClickHandler).not.toHaveBeenCalled();
  });

  it.each(["repoTextBox", "usernameTextBox"])(
    "render correctly on non-loading state and fires an event on Enter key",
    async (textbox) => {
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

      await waitFor(() => {
        expect(goClickHandler).toHaveBeenCalledWith(username, repo);
      });

      expect(cancelClickHandler).not.toHaveBeenCalled();
    },
  );

  it("move to repo text box when '/' is pressed", async () => {
    render(
      <RepoDetailsInputDesktop
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    );

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");

    expect(repoTextBox).not.toHaveFocus();

    userEvent.type(usernameTextBox, "user/");

    waitFor(() => {
      expect(repoTextBox).toHaveFocus();
    });
  });

  it("render correctly in loading state and fires an event on Cancel click", () => {
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

    expect(goClickHandler).not.toHaveBeenCalled();
    expect(cancelClickHandler).toHaveBeenCalled();
  });

  it("trim the username and repo", () => {
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

    expect(goClickHandler).toHaveBeenCalledWith(username, repo);
  });

  it("render a tooltip when hovering on repo details", async () => {
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
    "parse pasted GitHub URL",
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
