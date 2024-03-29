export const camelCase = (val: string) => {
	return val.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (_, letter) {
		return letter.toUpperCase()
	})
}

export const removeElement = (element: HTMLElement) => {
	element && element.parentNode && element.parentNode.removeChild(element)
}

export const extend = Object.assign

export const deepClone = <T>(obj: T): T => {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	if (Array.isArray(obj)) {
		const newArray: any[] = []
		for (let i = 0; i < obj.length; i++) {
			newArray[i] = deepClone(obj[i])
		}
		return newArray as T
	}

	const newObj: Record<string, any> = {}
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			newObj[key] = deepClone(obj[key])
		}
	}

	return newObj as T
}
