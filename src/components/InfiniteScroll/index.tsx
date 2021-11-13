import React from 'react';
import {withDefaultProps} from '../../utils/with-default-props'
import {NativeProps, withNativeProps} from '../../utils/native-props'
import { useLockFn, usePersistFn } from 'ahooks';
import {getScrollParent} from '../../utils/get-scroll-parent'
import Loading from '../Loading'

import './index.less'

const classPrefix = `py-infinite-scroll`
function isWindow(element: any | Window): element is Window {
  return element === window
}
type IProps = {
  loadMore: () => Promise<void>
  hasMore: boolean
  threshold?: number
} & NativeProps

const InfiniteScrollContent = ({ hasMore }: { hasMore: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          {/* <span>加载中</span> */}
          <Loading />
        </>
      ) : (
        <span>没有更多了</span>
      )}
    </>
  )
}
const InfiniteScroll= withDefaultProps({
  threshold: 250 
})<IProps>(p => {
  const doloadMore = useLockFn(() => p.loadMore())

  const elementRef = React.useRef<HTMLInputElement>(null)

  const checkTimeoutRef = React.useRef<number>()
  const check = usePersistFn(() => {
    window.clearTimeout(checkTimeoutRef.current)
    checkTimeoutRef.current = window.setTimeout(() => {
      const element = elementRef.current
      if (!element) return
      const parent = getScrollParent(element)
      if (!parent) return
      const elementTop = element.getBoundingClientRect().top
      const current = isWindow(parent) ? window.innerHeight : parent.getBoundingClientRect().bottom
      if (current >= elementTop - p.threshold) {
        doloadMore()
      }
    })
  })

  React.useEffect(() => {
    check()
  })

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return
    const parent = getScrollParent(element)
    if (!parent) return
    function scroll () {
      check()
    }
    parent.addEventListener('scroll', scroll)
    return () => {
      parent.removeEventListener('scroll', scroll)
    }
  }, [])

  return withNativeProps(
    p, 
    <div className={classPrefix} ref={elementRef}>
      {p.children && p.children}
      {!p.children && <InfiniteScrollContent hasMore={p.hasMore} /> }
    </div>
  )
});

export default InfiniteScroll;
