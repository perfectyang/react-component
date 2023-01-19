export const ut = {
	//返回日期
	DateTime(arr?: any[], valObj?: any) {
		arr = arr || []
		const newdate = new Date()
		const narr = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds']
		const vb = Object.assign(
			{
				YYYY: null,
				MM: null,
				DD: null,
				hh: newdate.getHours(),
				mm: newdate.getMinutes(),
				ss: newdate.getSeconds(),
			},
			valObj,
		)
		const ND = valObj == undefined ? newdate : new Date(vb.YYYY, vb.MM, vb.DD, vb.hh, vb.mm, vb.ss)
		if ((arr || []).length > 0) {
			arr.forEach((i, par) => {
				ND['set' + narr[i]](narr[i] == 'Month' ? parseInt(par) - 1 : parseInt(par))
			})
		}
		return {
			//返回此实例的Date值
			GetValue: () => ND,
			//获取此实例所表示日期的年份部分。
			GetYear: () => ND.getFullYear(),
			//获取此实例所表示日期的月份部分。
			GetMonth: () => ND.getMonth() + 1,
			//获取此实例所表示的日期为该月中的第几天。
			GetDate: () => ND.getDate(),
			//获取此实例所表示日期的小时部分。
			GetHours: () => ND.getHours(),
			//获取此实例所表示日期的分钟部分。
			GetMinutes: () => ND.getMinutes(),
			//获取此实例所表示日期的秒部分。
			GetSeconds: () => ND.getSeconds(),
		}
	},
	//补齐数位
	digit(num: number) {
		return num < 10 ? '0' + (num | 0) : num
	},
	//判断是否为数字
	isNum(value: string) {
		return /^[+-]?\d*\.?\d*$/.test(value) ? true : false
	},
	//获取本月的总天数
	getDaysNum(y: number, m: string | number) {
		var num = 31,
			isLeap = (y % 100 !== 0 && y % 4 === 0) || y % 400 === 0
		switch (parseInt(m)) {
			case 2:
				num = isLeap ? 29 : 28
				break
			case 4:
			case 6:
			case 9:
			case 11:
				num = 30
				break
		}
		return num
	},
	//获取月与年
	getYM(y: number, m: number, n: number) {
		var nd = new Date(y, m - 1)
		nd.setMonth(m - 1 + n)
		return {
			y: nd.getFullYear(),
			m: nd.getMonth() + 1,
		}
	},
	//获取上个月
	prevMonth(y: number, m: number, n?: number) {
		return this.getYM(y, m, 0 - (n || 1))
	},
	//获取下个月
	nextMonth(y: number, m: number, n?: number) {
		return this.getYM(y, m, n || 1)
	},
}

export const getLastDate = (year, month) => {
	return new Date(year, month, 0)
}

// 获取某个月的最后一天的日期, 月份是几月就传几月
export const getEndDay = (year, month) => {
	return new Date(year, month, 0).getDate()
}

// 获取某个月的第一天的周几, 月份是几月就传几月
export const getFirstWeek = (year, month) => {
	return new Date(year, month - 1, 1).getDay()
}

export const renderText = ({ y, m, d }) => {
	const date = new Date(`${y}/${m}/${d}`)
	const day = date.getDay()
	const curDate = date.getDate()
	if (day === 1 || curDate === 1) {
		return `${m}月${d}日`
	} else {
		return d
	}
}

export const computedWeek = (targetDate) => {
	let currentFirstDate
	const formatDate = (date) => {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const week =
			'(' +
			['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] +
			')'

		return {
			cls: 'arco-calendar-cell-date gray',
			y: year,
			m: month,
			d: day,
			week,
		}
	}
	var addDate = function (date, n) {
		date.setDate(date.getDate() + n)
		return date
	}
	const setDate = (date) => {
		var week = date.getDay() - 1
		date = addDate(date, week * -1)
		currentFirstDate = new Date(date)
		const result: any[] = []
		for (let i = 0; i < 7; i++) {
			const tmp = formatDate(i == 0 ? date : addDate(date, 1))
			result.push(tmp)
		}
		return result
	}
	setDate(new Date(targetDate.replace(/-/g, '/')))
	return {
		preWeek: () => {
			return setDate(addDate(currentFirstDate, -7))
		},
		nextWeek: () => {
			return setDate(addDate(currentFirstDate, 7))
		},
	}
}

export const chunk = (arr, size) => {
	const len = arr.length
	const rows: any[] = []
	for (let i = 0; i < len; i++) {
		const tmp = arr[i]
		if (i % size === 0) {
			rows.push([tmp])
		} else {
			rows[rows.length - 1].push(tmp)
		}
	}
	return rows
}

export const getTodayDate = () => {
	const todayDate = new Date()
	return {
		y: todayDate.getFullYear(),
		m: todayDate.getMonth() + 1,
		d: todayDate.getDate(),
	}
}

// 计算当月天数
export const computedCalendar = (yd: number, md: number) => {
	const lastMonEndDay = getEndDay(yd, md - 1) // 上个月的最后一天
	const curMonEndDay = getEndDay(yd, md) // 当前月的最后一天
	const week = getFirstWeek(yd, md) // 当前月的第一天是周几
	let lastWeekNum = week - 1 // 上个月占几个格子
	lastWeekNum = week === 0 ? 6 : lastWeekNum
	// 渲染几行几行
	const row = 6
	const column = 7
	const daysArr: Record<string, any>[] = []
	let prevStartDate = lastMonEndDay - lastWeekNum + 1 // 上个月的起始日期
	let curStartDate = 1
	let nextStartDate = 1

	for (let i = 0; i < row * column; i++) {
		if (i < lastWeekNum) {
			// 上个月的日期
			const lastDate = getLastDate(yd, md - 1)
			daysArr.push({
				y: lastDate.getFullYear(),
				m: lastDate.getMonth() + 1,
				d: prevStartDate++,
			})
		} else if (i >= lastWeekNum + curMonEndDay) {
			// 下个月的日期
			const nextDate = getLastDate(yd, md + 1)
			daysArr.push({
				y: nextDate.getFullYear(),
				m: nextDate.getMonth() + 1,
				d: nextStartDate++,
			})
		} else {
			// 当月的日期
			daysArr.push({
				y: yd,
				m: md,
				d: curStartDate++,
			})
		}
	}
	return daysArr
}

const markToday = (days) => {
	const toTodayDate = getTodayDate()
	days.forEach((cur) => {
		if (cur.y === toTodayDate.y && cur.m === toTodayDate.m) {
			cur.cls = 'arco-calendar-cell-date'
		} else {
			cur.cls = 'arco-calendar-cell-date gray'
		}
		const isToday = cur.y === toTodayDate.y && cur.m === toTodayDate.m && cur.d === toTodayDate.d
		if (isToday) {
			cur.cls = cur.cls + ' action'
		}
	})
}

export const prevWeekLogic = (curDays) => {
	const days = curDays.slice()
	const firstDay = days.slice(0, 7)[3]
	const { preWeek } = computedWeek(`${firstDay.y}-${firstDay.m}-${firstDay.d}`)
	const ret = preWeek()
	days.unshift(...ret)
	let i = 0
	while (i < 7) {
		days.pop()
		i++
	}
	markToday(days)
	return days
}

export const nextWeekLogic = (curDays) => {
	const days = curDays.slice()
	const lastDay = days[days.length - 3]
	const { nextWeek } = computedWeek(`${lastDay.y}-${lastDay.m}-${lastDay.d}`)
	const ret = nextWeek()
	days.push(...ret)
	let i = 0
	while (i < 7) {
		days.shift()
		i++
	}
	markToday(days)
	return days
}

// 处理当前日期提到第二行
export const restTodayPosition = (toDate) => {
	const calendar = computedCalendar(toDate.y, toDate.m)
	const groupCalendar = chunk(calendar, 7)
	// 找出当前日期排在第几行, 如果排在第二行之后，就要重置到第二行
	const row = groupCalendar.findIndex((group) => {
		return group.some((gp) => gp.y === toDate.y && gp.m === toDate.m && gp.d === toDate.d)
	})
	let realCalendar = calendar
	// 提升当前日期到第二行
	if (row > 1) {
		let page = row - 1
		while (page--) {
			realCalendar = nextWeekLogic(realCalendar)
		}
	}
	return realCalendar
}
