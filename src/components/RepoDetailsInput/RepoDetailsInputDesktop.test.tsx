import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RepoDetailsInputDesktop from "./RepoDetailsInputDesktop";
import { renderWithTheme } from "../../utils/test";

const goClickHandler = vi.fn();
const cancelClickHandler = vi.fn();

const username = "user";
const repo = "repo";

describe(RepoDetailsInputDesktop, () => {
  it("render correctly on non-loading state and fires an event on Go click", () => {
    renderWithTheme(
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
      renderWithTheme(
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
    renderWithTheme(
      <RepoDetailsInputDesktop
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    );

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox");

    expect(repoTextBox).not.toHaveFocus();

    await userEvent.type(usernameTextBox, `${username}/`);

    expect(repoTextBox).toHaveFocus();
  });

  it("render correctly in loading state and fires an event on Cancel click", () => {
    renderWithTheme(
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
    renderWithTheme(
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
    renderWithTheme(
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
      renderWithTheme(
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
