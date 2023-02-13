import mediaQuery from "css-mediaquery"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import GitHubToken from "./GitHubToken"
import { StorageType } from "../utils/GitHubUtils"

const createMatchMedia = (width: number) => (query: string) => ({
  matches: mediaQuery.match(query, { width }),
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

describe(GitHubToken, () => {
  const accessToken = "my_access_token"
  const storageType = StorageType.SessionStorage

  it("Display on large screen", async () => {
    window.matchMedia = createMatchMedia(1000)
    render(<GitHubToken accessToken={accessToken} storageType={storageType} />)
    expect(screen.getByText(accessToken)).toBeInTheDocument()

    const text = await screen.findByText(accessToken)
    userEvent.hover(text)

    await waitFor(() => {
      expect(
        screen.getByRole("tooltip", {
          name: `Access token stored in ${storageType}`,
          hidden: true,
        }),
      ).toBeVisible()
    })
  })

  it("Display on small screen", async () => {
    window.matchMedia = createMatchMedia(200)
    render(<GitHubToken accessToken={accessToken} storageType={storageType} />)

    expect(screen.queryByText(accessToken)).not.toBeInTheDocument()

    const keyIconBtn = screen.getByRole("button")
    fireEvent.click(keyIconBtn)

    await waitFor(() => {
      expect(
        screen.getByRole("tooltip", {
          name: `Access token '${accessToken}' stored in ${storageType}`,
          hidden: true,
        }),
      ).toBeVisible()
    })
  })
})
