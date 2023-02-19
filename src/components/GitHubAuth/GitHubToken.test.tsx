import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import GitHubToken from "./GitHubToken"
import { StorageType } from "../../utils/GitHubUtils"
import { createMatchMedia } from "../../utils/test"

describe(GitHubToken, () => {
  const accessToken = "my_access_token"
  const storageType = StorageType.SessionStorage

  const accessTokenShort = accessToken.slice(-6)

  it("Display on large screen", async () => {
    window.matchMedia = createMatchMedia(1000)
    render(<GitHubToken accessToken={accessToken} storageType={storageType} />)
    expect(screen.queryByText(accessToken)).not.toBeInTheDocument()
    expect(screen.getByText(accessTokenShort)).toBeInTheDocument()

    const text = await screen.findByText(accessTokenShort)
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
    expect(screen.queryByText(accessTokenShort)).not.toBeInTheDocument()

    const keyIconBtn = screen.getByRole("button")
    fireEvent.click(keyIconBtn)

    await waitFor(() => {
      expect(
        screen.getByRole("tooltip", {
          name: `Access token '${accessTokenShort}' stored in ${storageType}`,
          hidden: true,
        }),
      ).toBeVisible()
    })
  })
})
