import Alioss, { AliOssToken } from '../aliOss'
type handlerFn = (instance: any) => Promise<any>

const tokenInstance = new AliOssToken()
// 是否正在刷新的标记
let isRefreshing = false
//重试队列
const requests: any[] = []

let activeCount = 0 // 当前任务数
const limit = 6 // 并发控制数

const ossConfig = {
	pointer: {} as any,
}

const next = () => {
	activeCount--
	if (requests.length) {
		requests.shift()()
	}
}

// 同时并发请求多个任务
const runParallelTask = () => {
	let i = 0
	const len = Math.min(requests.length, limit)
	while (i < len && len > 0) {
		requests.shift()()
		i++
		// console.log('开始', i, activeCount)
	}
}

export function parallelAsync(fn: handlerFn, config = {}) {
	const run = () => {
		activeCount++
		const instance = new Alioss(Object.assign(config, ossConfig.pointer))
		fn(instance).then(
			() => {
				next()
			},
			() => {
				next()
			}
		)
	}
	if (!isRefreshing) {
		isRefreshing = true
		requests.push(run)
		//调用刷新token的接口
		tokenInstance
			.checkToken()
			.then((params) => {
				// token 刷新后将数组的方法重新执行
				ossConfig.pointer = params
				if (activeCount < limit) {
					runParallelTask()
				}
				isRefreshing = false
			})
			.catch(() => {
				isRefreshing = false
			})
	} else {
		requests.push(run)
	}
}
