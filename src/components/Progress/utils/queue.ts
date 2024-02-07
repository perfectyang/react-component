import { isFunction } from './is'

export const queue = (() => {
	const pendding: any[] = []

	const next = () => {
		const fn = pendding.shift()
		isFunction(fn) && fn(next)
	}
	return (fn: any) => {
		pendding.push(fn)
		if (pendding.length === 1) next()
	}
})()
