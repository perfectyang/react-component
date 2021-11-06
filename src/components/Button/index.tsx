import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
import { withDefaultProps } from '../../utils/with-default-props';
import classNames from 'classnames'
import './index.less'


export type ButtonProps = {
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  fill?: 'solid' | 'outline' | 'none'
  size?: 'mini' | 'small' | 'middle' | 'large'
  block?: boolean
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: 'submit' | 'reset' | 'button'
} & NativeProps<
  | '--text-color'
  | '--background-color'
  | '--border-radius'
  | '--border-width'
  | '--border-style'
  | '--border-color'
>
const classPrefix = `py-button`

const Button: FC<ButtonProps> = (props => {
  const disabled = props.disabled || props.loading
  return <button
    type={props.type}
    onClick={props.onClick}
    className={classNames(
      classPrefix,
      props.color ? `${classPrefix}-${props.color}` : null,
      {
        [`${classPrefix}-block`]: props.block,
        [`${classPrefix}-disabled`]: disabled,
        [`${classPrefix}-fill-outline`]: props.fill === 'outline',
        [`${classPrefix}-fill-none`]: props.fill === 'none',
        [`${classPrefix}-mini`]: props.size === 'mini',
        [`${classPrefix}-small`]: props.size === 'small',
        [`${classPrefix}-large`]: props.size === 'large',
        [`${classPrefix}-loading`]: props.loading,
      }
    )}
    disabled={disabled}
  >{
    props.loading ? (
      <>
        <div>{props.loadingText}</div>
      </>
    ) : (
      props.children
    )
  }</button>
})

export default Button;
