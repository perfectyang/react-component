import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'
import usePropsValue from '../../hooks/usePropsValue'
import SpinIcon from './loading.svg'
import { NativeProps, withNativeProps } from '../../utils/native-props'

const classPrefix = `py-switch`

export type SwitchProps = {
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  checkedText?: ReactNode
  uncheckedText?: ReactNode
} & NativeProps<'--checked-color'>

const defaultProps = {
  defaultChecked: false,
}

export const Switch: FC<SwitchProps> = p => {
  const props = Object.assign(defaultProps, p)
  const disabled = props.disabled || props.loading || false

  const [checked, setChecked] = usePropsValue({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange,
  })

  return withNativeProps(
    props,
    <label
      className={classNames(classPrefix, {
        [`${classPrefix}-checked`]: checked,
        [`${classPrefix}-disabled`]: disabled,
      })}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={e => {
          disabled || setChecked(e.target.checked)
        }}
        disabled={disabled}
      />
      <div className={`${classPrefix}-checkbox`}>
        <div className={`${classPrefix}-handle`}>
          {
            // 禁用状态优先于加载状态
            props.disabled ||
              (props.loading && (
                <>
                  <img src={SpinIcon} className={`${classPrefix}-icon`} />
                </>
              ))
          }
        </div>
        <div className={`${classPrefix}-inner`}>
          {checked ? props.checkedText : props.uncheckedText}
        </div>
      </div>
    </label>
  )
}
