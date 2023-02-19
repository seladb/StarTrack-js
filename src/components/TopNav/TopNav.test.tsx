import { render, screen } from "@testing-library/react"
import TopNav from "./TopNav"
import packageJson from "../../../package.json"

describe(TopNav, () => {
  it("Display correct version", () => {
    render(<TopNav />)
    expect(screen.getByText(`StarTrack v${packageJson.version}`)).toBeInTheDocument()
  })
})
