import {render, unmountComponentAtNode} from 'react-dom'
import { ReactElement } from 'react'

export function renderToBody(el: ReactElement) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  function unmount() {
    const unmountResult = unmountComponentAtNode(container)
    if (unmountResult && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }
  render(el, container)
  return unmount 
}