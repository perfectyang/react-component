import Alioss, { AliOssToken } from './aliOss'
type handlerFn = (instance: any) => any

const tokenInstance = new AliOssToken()
// 是否正在刷新的标记
let isRefreshing = false
//重试队列
let requests: handlerFn[] = []

export function runPromise(fn: handlerFn, config = {}) {
	if (!isRefreshing) {
		isRefreshing = true
		requests.push(fn)
		//调用刷新token的接口
		tokenInstance
			.checkToken()
			.then((params) => {
				// token 刷新后将数组的方法重新执行
				requests.forEach((cb: any) => {
					const instance = new Alioss(Object.assign(config, params))
					cb(instance)
				})
				requests = [] // 重新请求完清空
				isRefreshing = false
			})
			.catch(() => {
				isRefreshing = false
			})
	} else {
		requests.push(fn)
	}
}
