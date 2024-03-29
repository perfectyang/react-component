import type { DightEnum } from './utils/typed'

export type Minimum = DightEnum<101>
export type NProgressSetting = {
	primaryColor: string
	minimum: Minimum
	easing: 'linear' | string
	positionUsing: string
	speed: number
	trickle: boolean
	trickleSpeed: number
	showSpinner: boolean
	barSelector: string
	spinnerSelector: string
	parent: HTMLElement
	template: string
}

export const DEFAULT_SETTINGS = (): NProgressSetting => ({
	primaryColor: '#29d',
	minimum: 1,
	easing: 'linear',
	positionUsing: '',
	speed: 200,
	trickle: true,
	trickleSpeed: 200,
	showSpinner: false,
	barSelector: '[role="bar"]',
	spinnerSelector: '[role="spinner"]',
	parent: document.body,
	template: '<div class="bar" role="bar"><div class="peg"></div></div>',
})
