export const isHTMLElement = (val: unknown): val is HTMLElement => val instanceof HTMLElement

export const isFunction = (val: unknown): val is any => typeof val === 'function'

export const isNumber = (val: unknown): val is number => typeof val === 'number'
