// #ff6161 ---> xx,xx,xx
const colorRgb = function(s: string){
	let sColor = s.toLowerCase()
	const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			let sColorNew = '#'
			for (let i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1))
			}
			sColor = sColorNew
		}
		let sColorChange = []
		for (let i=1; i < 7; i += 2) {
			sColorChange.push(parseInt('0x'+sColor.slice(i, i+2)))
		}
    return sColorChange.join(',')
	}
	return sColor
}

export default colorRgb