import React from "react"
import expect from "expect"
import { shallow, mount } from "enzyme"
import HighlightCode from "core/plugins/syntax-highlighting/components/HighlightCode"
import SyntaxHighlighter from "core/plugins/syntax-highlighting/components/SyntaxHighlighter"
import PlainTextViewer from "core/plugins/syntax-highlighting/components/PlainTextViewer"
import SyntaxHighlighterWrapper from "core/plugins/syntax-highlighting/wrap-components/SyntaxHighlighter"

const fakeGetConfigs = () => ({ syntaxHighlight: { activated: true, theme: "agate" }})
const fakeGetComponent = (name, isContainer) => {
  const components = { HighlightCode, SyntaxHighlighter }
  const Component = components[name]

  if (isContainer) {
    return ({ ...props }) => {
      return <Component getConfigs={fakeGetConfigs} getComponent={fakeGetComponent} {...props} />
    }
  }

  return Component
}

describe("<HighlightCode />", () => {
  it("should render a Download button if downloadable", () => {
    const props = { downloadable: true, getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = shallow(<HighlightCode {...props} />)
    expect(wrapper.find(".download-contents").length).toEqual(1)
  })

  it("should render a Copy To Clipboard button if copyable", () => {
    const props = { canCopy: true, getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = shallow(<HighlightCode {...props} />)
    expect(wrapper.find("CopyToClipboard").length).toEqual(1)
  })

  it("should render values in a preformatted element", () => {
    const value = "test text"
    const props = { children: value , getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = mount(<HighlightCode {...props} />)
    const preTag = wrapper.find("pre")

    expect(preTag.length).toEqual(1)
    expect(preTag.text()).toEqual(value)
  })

  it("should make the preformatted element focusable so it can be scrolled with the keyboard", () => {
    const props = { children: "test text", getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = mount(<HighlightCode {...props} />)

    expect(wrapper.find("pre").getDOMNode().getAttribute("tabindex")).toEqual("0")
  })

  it("should make the preformatted element focusable when syntax highlighting is deactivated", () => {
    const system = {
      getConfigs: () => ({ syntaxHighlight: { activated: false } }),
      getComponent: () => PlainTextViewer,
    }
    const WrappedSyntaxHighlighter = SyntaxHighlighterWrapper(SyntaxHighlighter, system)
    const getComponent = (name) =>
      name === "SyntaxHighlighter" ? WrappedSyntaxHighlighter : fakeGetComponent(name)
    const props = { children: "test text", getConfigs: system.getConfigs, getComponent }
    const wrapper = mount(<HighlightCode {...props} />)
    const preTag = wrapper.find("pre")

    expect(preTag.length).toEqual(1)
    expect(preTag.getDOMNode().getAttribute("tabindex")).toEqual("0")
  })
})
