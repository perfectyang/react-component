import React from 'react';
import { useSpring, animated } from '@react-spring/web'
import { createPortal } from 'react-dom';
import './index.less'
import { PropagationEvent, withStopPropagation } from '../../hooks/withStopPropagation';
import colorRgb from '../../utils/color-rgb';

interface IProps {
  visible?: boolean
  onMaskClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  destroyOnClose?: boolean
  forceRender?: boolean
  disableBodyScroll?: boolean
  color?: string;
  opacity?: 'default' | 'thin' | 'thick' | number
  afterShow?: () => void
  afterClose?: () => void
  style?: React.CSSProperties
  stopPropagation?: PropagationEvent[]
}
const defaultProps = {
  visible: true,
  destroyOnClose: false,
  forceRender: false,
  opacity: 'default',
  disableBodyScroll: true,
  getContainer: null,
  stopPropagation: ['click'],
}

const classPrefix = `py-mask`

const opacityRecord = {
  default: 0.55,
  thin: 0.35,
  thick: 0.75,
}
const Mask: React.FC<IProps> = (p) => {
  const props = Object.assign(defaultProps, p)
  const background = React.useMemo(() => {
    const opacity = opacityRecord[props.opacity] ?? props.opacity
    const rgb = props.color ? colorRgb(props.color) : '0, 0, 0'
    return `rgba(${rgb}, ${opacity})`
  }, [props.color, props.opacity])

  const [active, setActive] = React.useState(props.visible)

  const { opacity } = useSpring({
    opacity: props.visible ? 1 : 0,
    config: {
      precision: 0.01,
      mass: 1,
      tension: 200,
      friction: 30,
    },
    onStart: () => {
      setActive(true)
    },
    onRest: () => {
      setActive(props.visible)
      if (props.visible) {
        props.afterShow?.()
      } else {
        props.afterClose?.()
      }
    },
  })
  const node = withStopPropagation(
    props.stopPropagation
    ,
    <>
    <animated.div
        className={classPrefix}
        style={{
          ...props.style,
          background,
          opacity,
          display: active ? 'unset' : 'none',
        }}>
        {props.onMaskClick && (
          <div
            className={`${classPrefix}-aria-button`}
            role='button'
            aria-label='mask'
            onClick={props.onMaskClick}
          />
        )}
        <div className={`${classPrefix}-content`}>
          {props.children}
        </div>
      </animated.div>
    </>
  );
  return active ? createPortal(node, document.body) : null
};

export default Mask;
