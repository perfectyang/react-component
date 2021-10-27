import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import './index.less'

const classPrefix = `py-input`

type NativeInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type EnterKeyHintProps = NativeInputProps extends { enterKeyHint?: unknown }
  ? {
      enterKeyHint?: NativeInputProps['enterKeyHint']
    }
  : {}

export type InputProps = Pick<
  NativeInputProps,
  | 'maxLength'
  | 'minLength'
  | 'max'
  | 'min'
  | 'autoComplete'
  | 'pattern'
  | 'type'
  | 'onFocus'
  | 'onBlur'
  | 'autoCapitalize'
  | 'autoCorrect'
> &
  EnterKeyHintProps & {
    value?: string
    defaultValue?: string
    onChange?: (val: string) => void
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    clearable?: boolean
    onClear?: () => void
    id?: string
  } 
const defaultProps = {
  defaultValue: '',
}

export type InputRef = {
  clear: () => void
  focus: () => void
  blur: () => void
}

const Input = forwardRef<InputRef, InputProps>((p, ref) => {
  const props = Object.assign(defaultProps, p)
  const [value, setValue] = useState('')
  const [hasFocus, setHasFocus] = useState(false)
  const nativeInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    clear: () => {
      setValue('')
    },
    focus: () => {
      nativeInputRef.current?.focus()
    },
    blur: () => {
      nativeInputRef.current?.blur()
    },
  }))

  return (
    <div className={`${classPrefix}-wrapper`}>
      <input
        ref={nativeInputRef}
        className={classPrefix}
        value={value}
        onChange={e => {
          setValue(e.target.value)
        }}
        onFocus={e => {
          setHasFocus(true)
          props.onFocus?.(e)
        }}
        onBlur={e => {
          setHasFocus(false)
          props.onBlur?.(e)
        }}
        id={props.id}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        maxLength={props.maxLength}
        minLength={props.minLength}
        max={props.max}
        min={props.min}
        autoComplete={props.autoComplete}
        enterKeyHint={props.enterKeyHint}
        pattern={props.pattern}
        type={props.type}
        autoCapitalize={props.autoCapitalize}
        autoCorrect={props.autoCorrect}
      />
      {props.clearable && !!value && hasFocus && (
        <div
          className={`${classPrefix}-clear`}
          onMouseDown={e => {
            e.preventDefault()
          }}
          onClick={() => {
            setValue('')
            props.onClear?.()
          }}
        >
          x
        </div>
      )}
    </div>
  )
})
export default Input