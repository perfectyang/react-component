import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import Toast from './Toast'

interface IParams {
  content: string;
  onClose?: () => void
}
interface IProps {
  ({content, onClose}: IParams): void
}

const containers = [] as HTMLDivElement[]
function unmount(container: HTMLDivElement) {
  const unmountResult = unmountComponentAtNode(container)
  if (unmountResult && container.parentNode) {
    container.parentNode.removeChild(container)
  }
}

function clear() {
  while (true) {
    const container = containers.pop()
    if (!container) break
    unmount(container)
  }
}

const Index: IProps = ({
  content,
  onClose
}) => {
  const Container = document.createElement('div')
  clear()
  containers.push(Container)
  const innerClose = function () {
    unmountComponentAtNode(Container)
    onClose?.()
  }
  render(<Toast content={content} visible={true} onClose={innerClose} />, Container)
};

export default Index;
