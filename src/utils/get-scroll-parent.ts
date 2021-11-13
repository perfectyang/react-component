

function isElement (node: Element) {
  const ELEMENTTYPE = 1
  return (
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === ELEMENTTYPE
  ) 
}
const overflowScrollReg = /scroll|auto/i
type ScrollElement = HTMLElement | Window

export function getScrollParent (
  node: Element, 
  root: ScrollElement | null | undefined = window
) {
  let el = node
  while (el && el !== root && isElement(el)) {
    const {overflowY} = window.getComputedStyle(el)
    if (overflowScrollReg.test(overflowY)) {
      return el
    }
    el = el.parentNode as Element
  }
  return root
}