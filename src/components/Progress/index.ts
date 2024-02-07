/* eslint-disable */
import { clamp, toBarPerc } from './utils/calc'
import { addClass, removeClass, css } from './utils/cls'
import { isHTMLElement, isNumber } from './utils/is'
import { removeElement } from './utils/basic'
import { queue } from './utils/queue'
import { DEFAULT_SETTINGS, type NProgressSetting, type Minimum } from './settings'
import './style.less'

const ELEMENT_ID = 'nprogress'

class NProgress {
	settings: NProgressSetting
	ELEMENT_ID: string

	constructor(options) {
		this.settings = {
			...DEFAULT_SETTINGS(),
			...(options ?? {}),
		}
		this.ELEMENT_ID = ELEMENT_ID
	}

	isRendered(): boolean {
		return !!this.settings.parent.querySelector(`.${this.ELEMENT_ID}`)
	}

	status: number | null = null

	set(n: Minimum) {
		const settings = this.settings
		n = clamp<Minimum>(n, settings.minimum, 100)

		this.status = n === 100 ? null : n

		const progress: any = this.render(+(this.status || 0) as Minimum)!
		const bar = progress?.querySelector<HTMLElement>(this.settings.barSelector)!
		const speed = this.settings.speed
		const ease = this.settings.easing

		progress.offsetWidth /* Repaint */

		queue((next: Function) => {
			if (this.settings.positionUsing === '') {
				this.settings.positionUsing = this.getPositionCss()
			}

			css(bar, this.barPositionCSS(n, speed, ease))

			if (n === 100) {
				// Fade out
				css(progress, {
					transition: 'none',
					opacity: 1,
				})
				progress.offsetWidth /* Repaint */

				setTimeout(() => {
					css(progress, {
						transition: `all ${speed}ms linear`,
						opacity: 0,
					})
					setTimeout(() => {
						this.remove()
						next()
					}, speed)
				}, speed)
			} else {
				setTimeout(next, speed)
			}
		})
	}

	start() {
		if (!this.status) this.set(0)
		const work = () => {
			setTimeout(() => {
				if (!this.status) return
				this.trickle()
				work()
			}, this.settings.trickleSpeed)
		}
		if (this.settings.trickle) work()
	}

	done() {
		this.set(100)
	}

	render(from: Minimum) {
		if (this.isRendered()) return this.settings.parent.querySelector(`.${this.ELEMENT_ID}`)

		const progress = document.createElement('div')
		progress.className = this.ELEMENT_ID
		progress.innerHTML = this.settings.template

		document.documentElement.style.setProperty(
			'--progress-primary-color',
			this.settings.primaryColor
		)

		const bar = progress.querySelector<HTMLElement>(this.settings.barSelector)!
		const perc = from ? toBarPerc(from) : '-100'

		const parent = this.settings.parent
		css(bar, {
			transition: 'all 0 linear',
			transform: `translate3d(${perc}%, 0, 0)`,
		})
		if (parent !== document.body) {
			addClass(parent, 'nprogress-custom-parent')
		}

		parent.append(progress)
		return progress
	}

	inc(amount?: number | string) {
		let n: Minimum = +(this.status || 0) as Minimum
		// console.log('nnnn', n)
		if (!n) {
			return this.start()
		} else if (n > 100) {
			return
		} else {
			if (!isNumber(amount)) {
				if (n >= 0 && n < 20) {
					amount = 10
				} else if (n >= 20 && n < 50) {
					amount = 4
				} else if (n >= 50 && n < 80) {
					amount = 2
				} else if (n >= 80 && n < 100) {
					amount = 1
				} else {
					amount = 0
				}
			}

			n = clamp(n + amount, 0, 90)
			return this.set(n)
		}
	}

	remove() {
		const parent = this.settings.parent
		// console.log('parent', parent)
		removeClass(parent, 'nprogress-custom-parent')
		const progress: any = parent.querySelector(`.${this.ELEMENT_ID}`)
		progress && removeElement(progress)
	}

	getPositionCss(): 'translate3d' | 'translate' | 'margin' {
		const bodyStyle = document.body.style

		const vendorPrefix =
			'WebkitTransform' in bodyStyle
				? 'Webkit'
				: 'MozTransform' in bodyStyle
				? 'Moz'
				: 'msTransform' in bodyStyle
				? 'ms'
				: 'OTransform' in bodyStyle
				? 'O'
				: ''

		if (vendorPrefix + 'Perspective' in bodyStyle) {
			return 'translate3d'
		} else if (vendorPrefix + 'Transform' in bodyStyle) {
			return 'translate'
		} else {
			return 'margin'
		}
	}

	barPositionCSS(n: Minimum, speed: number, ease: string) {
		let barCSS: Record<string, any>

		if (this.settings.positionUsing === 'translate3d') {
			barCSS = { transform: `translate3d(${toBarPerc(n)}%, 0, 0)` }
		} else if (this.settings.positionUsing === 'translate') {
			barCSS = { transform: `translate(${toBarPerc(n)}%, 0)` }
		} else {
			barCSS = { 'margin-left': `${toBarPerc(n)}%` }
		}

		barCSS['transition'] = `all ${speed}ms ${ease}`

		return barCSS
	}

	trickle() {
		return this.inc()
	}
}

export default NProgress
