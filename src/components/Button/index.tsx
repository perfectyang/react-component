import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
import { withDefaultProps } from '../../utils/with-default-props';


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

const Button: FC<ButtonProps> = (props => {
  const disabled = props.disabled || props.loading
  return <button
    type={props.type}
    onClick={props.onClick}
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
