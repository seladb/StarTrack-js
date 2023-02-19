import { fireEvent, render, screen } from "@testing-library/react"
import RepoDetailsInputMobile from "./RepoDetailsInputMobile"

const goClickHandler = jest.fn()
const cancelClickHandler = jest.fn()

const username = "user"
const repo = "repo"

describe(RepoDetailsInputMobile, () => {
  it("Renders correctly on non-loading state and fires an event on Go click", () => {
    render(
      <RepoDetailsInputMobile
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    )

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox")
    fireEvent.change(usernameTextBox, { target: { value: username } })
    fireEvent.change(repoTextBox, { target: { value: repo } })

    const goBtn = screen.getByRole("button")
    fireEvent.click(goBtn)

    expect(goClickHandler).toBeCalledWith(username, repo)
    expect(cancelClickHandler).not.toBeCalled()
  })

  it("Renders correctly in loading state and fires an event on Cancel click", () => {
    render(
      <RepoDetailsInputMobile
        loading={true}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    )

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox")
    fireEvent.change(usernameTextBox, { target: { value: username } })
    fireEvent.change(repoTextBox, { target: { value: repo } })

    const [loadingBtn, cancelBtn] = screen.getAllByRole("button")

    expect(loadingBtn.textContent).toStrictEqual("Loading...")

    fireEvent.click(cancelBtn)

    expect(goClickHandler).not.toBeCalled()
    expect(cancelClickHandler).toBeCalled()
  })

  it("Trims the username and repo", () => {
    render(
      <RepoDetailsInputMobile
        loading={false}
        onGoClick={goClickHandler}
        onCancelClick={cancelClickHandler}
      />,
    )

    const [usernameTextBox, repoTextBox] = screen.getAllByRole("textbox")
    fireEvent.change(usernameTextBox, { target: { value: `   ${username}   ` } })
    fireEvent.change(repoTextBox, { target: { value: ` ${repo}  ` } })

    const goBtn = screen.getByRole("button")
    fireEvent.click(goBtn)

    expect(goClickHandler).toBeCalledWith(username, repo)
  })
})
