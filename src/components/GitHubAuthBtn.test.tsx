import mediaQuery from "css-mediaquery"
import { fireEvent, render, screen } from "@testing-library/react"
import GitHubAuthBtn from "./GitHubAuthBtn"

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

describe("Auth button", () => {
  const text = "Text"
  const Icon = jest.fn()
  const onBtnClick = jest.fn()

  it("Display on large screen", () => {
    window.matchMedia = createMatchMedia(1000)
    render(<GitHubAuthBtn text={text} Icon={Icon} />)
    expect(screen.getByText(text)).toBeInTheDocument()
    expect(Icon).toBeCalled()
  })

  it("Display on small screen", () => {
    window.matchMedia = createMatchMedia(200)
    render(<GitHubAuthBtn text={text} Icon={Icon} />)
    expect(screen.queryByText(text)).not.toBeInTheDocument()
    expect(Icon).toBeCalled()
  })

  it("Responds to a click event", () => {
    render(<GitHubAuthBtn text={text} Icon={Icon} onClick={onBtnClick} />)
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(onBtnClick).toBeCalled()
  })
})
