import mediaQuery from "css-mediaquery"
import { render, screen } from "@testing-library/react"
import TopNav from "./TopNav"
import packageJson from "../../package.json"

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

describe("Top navigation", () => {
  it("Display on large screen", () => {
    window.matchMedia = createMatchMedia(1000)
    render(<TopNav />)
    expect(screen.getByText(`StarTrack v${packageJson.version}`)).toBeInTheDocument()
    expect(screen.getByText("Project On GitHub")).toBeInTheDocument()
  }),
    it("Display on small screen", () => {
      window.matchMedia = createMatchMedia(200)
      render(<TopNav />)
      expect(screen.getByText(`StarTrack v${packageJson.version}`)).toBeInTheDocument()
      expect(screen.queryByText("Project On GitHub")).not.toBeInTheDocument()
    })
})
