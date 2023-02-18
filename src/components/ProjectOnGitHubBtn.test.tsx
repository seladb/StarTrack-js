import { render, screen } from "@testing-library/react"
import { createMatchMedia } from "../utils/test"
import ProjectOnGitHubBtn from "./ProjectOnGitHubBtn"

describe(ProjectOnGitHubBtn, () => {
  it("Display on large screen", () => {
    window.matchMedia = createMatchMedia(1000)
    render(<ProjectOnGitHubBtn />)
    expect(screen.getByText("Project On GitHub")).toBeInTheDocument()
  }),
    it("Display on small screen", () => {
      window.matchMedia = createMatchMedia(200)
      render(<ProjectOnGitHubBtn />)
      expect(screen.queryByText("Project On GitHub")).not.toBeInTheDocument()
    })
})
