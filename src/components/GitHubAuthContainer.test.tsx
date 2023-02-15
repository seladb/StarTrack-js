import { fireEvent, render, screen } from "@testing-library/react"
import GitHubAuthContainer from "./GitHubAuthContainer"
import * as GitHubUtils from "../utils/GitHubUtils"

// const mockGitHubAuthBtn = jest.fn()
// jest.mock("./GitHubAuthBtn", () => ({
//   __esModule: true,
//   default: (props: unknown[]) => {
//     mockGitHubAuthBtn(props)
//     return <></>
//   }
// }))

const mockGitHubToken = jest.fn()
jest.mock("./GitHubToken", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockGitHubToken(props)
    return <></>
  },
}))

interface mockGitHubAuthFormProps {
  onClose: (accessToken: string | null) => void
}

const accessToken = "access_token"

const MockGitHubAuthForm = ({ onClose }: mockGitHubAuthFormProps) => {
  return (
    <div>
      <button data-testid='form-login' onClick={() => onClose(accessToken)} />
      <button data-testid='form-close' onClick={() => onClose(null)} />
    </div>
  )
}

jest.mock("./GitHubAuthForm", () => ({
  __esModule: true,
  default: ({ onClose }: mockGitHubAuthFormProps, props: unknown[]) => {
    return <MockGitHubAuthForm onClose={onClose} {...props} />
  },
}))

describe(GitHubAuthContainer, () => {
  it("Renders login state", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValue(accessToken)

    render(<GitHubAuthContainer />)

    expect(screen.getByText("Log Out")).toBeInTheDocument()
    expect(mockGitHubToken).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: accessToken }),
    )
  })

  it("Renders already logged in state", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValue(null)

    render(<GitHubAuthContainer />)

    expect(screen.getByText("GitHub Authentication")).toBeInTheDocument()
    expect(mockGitHubToken).not.toHaveBeenCalled()
  })

  it("Executes logout", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValue(accessToken)
    const mockRemoveAccessToken = jest.spyOn(GitHubUtils, "removeAccessToken")

    render(<GitHubAuthContainer />)

    expect(screen.getByText("Log Out")).toBeInTheDocument()

    const logoutBtn = screen.getByRole("button")
    fireEvent.click(logoutBtn)

    expect(mockRemoveAccessToken).toHaveBeenCalled()

    expect(screen.getByText("GitHub Authentication")).toBeInTheDocument()
  })

  it("Executes login", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValue(null)

    render(<GitHubAuthContainer />)

    expect(screen.getByText("GitHub Authentication")).toBeInTheDocument()

    const loginBtn = screen.getByText("GitHub Authentication")
    fireEvent.click(loginBtn)

    const formLoginBtn = screen.getByTestId("form-login")
    fireEvent.click(formLoginBtn)

    expect(screen.getByText("Log Out")).toBeInTheDocument()
    expect(mockGitHubToken).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: accessToken }),
    )
  })

  it("Closes form without completing the login process", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValue(null)

    render(<GitHubAuthContainer />)

    expect(screen.getByText("GitHub Authentication")).toBeInTheDocument()

    const loginBtn = screen.getByText("GitHub Authentication")
    fireEvent.click(loginBtn)

    const formCloseBtn = screen.getByTestId("form-close")
    fireEvent.click(formCloseBtn)

    expect(screen.getByText("GitHub Authentication")).toBeInTheDocument()
    expect(mockGitHubToken).not.toHaveBeenCalled()
  })
})
