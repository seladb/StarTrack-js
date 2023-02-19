import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GitHubAuthForm from "./GitHubAuthForm";
import * as GitHubUtils from "../../utils/GitHubUtils";

describe(GitHubAuthForm, () => {
  const onClose = jest.fn();
  const accessTokenValue = "access_token";

  const setup = (isTokenValid: boolean) => {
    const validateAndStoreAccessTokenMock = jest
      .spyOn(GitHubUtils, "validateAndStoreAccessToken")
      .mockReturnValue(Promise.resolve(isTokenValid));

    render(<GitHubAuthForm open={true} onClose={onClose} />);

    const textBox = screen.getByRole("textbox") as HTMLInputElement;
    const loginBtn = screen.getByRole("button", { name: "Login" });
    const closeBtn = screen.getByRole("button", { name: "Close" });
    const checkBox = screen.getByRole("checkbox");

    return {
      textBox: textBox,
      loginBtn: loginBtn,
      closeBtn: closeBtn,
      checkBox: checkBox,
      validateAndStoreAccessTokenMock: validateAndStoreAccessTokenMock,
    };
  };

  it("Handles valid access token", async () => {
    const { textBox, loginBtn, validateAndStoreAccessTokenMock } = setup(true);

    fireEvent.change(textBox, { target: { value: accessTokenValue } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(validateAndStoreAccessTokenMock).toHaveBeenCalledWith(
        accessTokenValue,
        GitHubUtils.StorageType.SessionStorage,
      );
      expect(onClose).toHaveBeenCalledWith(accessTokenValue);
      expect(textBox.value).toBe("");
    });
  });

  it("Handles valid access token and save in local storage", async () => {
    const { textBox, loginBtn, checkBox, validateAndStoreAccessTokenMock } = setup(true);

    fireEvent.change(textBox, { target: { value: accessTokenValue } });
    fireEvent.click(checkBox);
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(validateAndStoreAccessTokenMock).toHaveBeenCalledWith(
        accessTokenValue,
        GitHubUtils.StorageType.LocalStorage,
      );
      expect(onClose).toHaveBeenCalledWith(accessTokenValue);
      expect(textBox.value).toBe("");
    });
  });

  it("Cleanup when close", async () => {
    const { textBox, closeBtn, validateAndStoreAccessTokenMock } = setup(true);

    fireEvent.change(textBox, { target: { value: accessTokenValue } });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(validateAndStoreAccessTokenMock).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledWith(null);
      expect(textBox.value).toBe("");
    });
  });

  it("Handles missing token", async () => {
    const { loginBtn, validateAndStoreAccessTokenMock } = setup(true);

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText("Access token is empty or invalid.")).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
      expect(validateAndStoreAccessTokenMock).not.toHaveBeenCalled();
    });
  });

  it("Handles invalid token", async () => {
    const { textBox, loginBtn, validateAndStoreAccessTokenMock } = setup(false);

    fireEvent.change(textBox, { target: { value: accessTokenValue } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(validateAndStoreAccessTokenMock).toHaveBeenCalledWith(
        accessTokenValue,
        GitHubUtils.StorageType.SessionStorage,
      );
      expect(screen.getByText("Access token is empty or invalid.")).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("Cleanup when close after invalid token", async () => {
    const { textBox, loginBtn, closeBtn } = setup(true);

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText("Access token is empty or invalid.")).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalledWith(null);
    });

    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("These credentials aren't stored in any server."),
      ).toBeInTheDocument();
      expect(onClose).toHaveBeenCalledWith(null);
      expect(textBox.value).toBe("");
    });
  });
});
