import OSS from 'ali-oss'
import fileMd5 from './utils/md5'
import { randomid } from '@util/tools'
import { checkHashHandler, ossStsTokenHandler, ossUploadedHandler } from '@/apis/modules/common'
import { getVideoScale, getVideoSize } from '@util'

interface IAliOss {
	accessKeyId: string
	accessKeySecret: string
	bucket: string | 'dms-upload-dev-sg'
	stsToken: string
	endpoint: string
	[key: string]: any
}

type customFile = File & {
	uploadVideoSize?: boolean
	fakeFileId?: string
}

interface IOssUpload {
	/**
	 * MD5
	 */
	hash: string
	/**
	 * 文件类型，即 Content-Type
	 */
	type: string
	/**
	 * 原始文件名
	 */
	name: string
	/**
	 * 移动到的目标目录
	 */
	path?: string
	/**
	 * 文件大小(单位byte)
	 */
	size: number
	/**
	 * 前端上传的 url（临时）
	 */
	url: string
}

export class AliOssToken {
	private params: IAliOss
	private expiration: string
	constructor() {
		this.params = {
			accessKeyId: '',
			accessKeySecret: '',
			bucket: 'dms-upload-dev-sg',
			stsToken: '',
			endpoint: 'oss-accelerate.aliyuncs.com',
			// secure: true,
		}
		this.expiration = ''
	}
	getOssToken() {
		return ossStsTokenHandler().then((data: any) => {
			this.params.accessKeyId = data.accessKeyId
			this.params.accessKeySecret = data.accessKeySecret
			this.params.stsToken = data.securityToken
			this.params.endpoint = data.endpoint
			this.params.bucket = data.bucket
			this.expiration = data.expiration
		})
	}
	async checkToken() {
		return new Promise(async (resolve) => {
			if (!this.expiration) {
				await this.getOssToken()
				resolve(this.params)
			} else {
				const beforeTime = new Date(this.expiration).getTime()
				const nowTime = new Date().getTime()
				const leftTime = beforeTime - nowTime
				if (leftTime < 0) {
					await this.getOssToken()
					resolve(this.params)
				}
				resolve(this.params)
			}
		})
	}
}
//
const defaultConfig = ({ contentDisposition }) => ({
	headers: {
		'Content-Disposition': contentDisposition || 'attachment', //attachment 下载， inline在线查看
	},
})

export default class AliOss {
	// private params: IAliOss
	private client: any
	private filePath: string
	private abortCheckpoint: 0
	private progress: any
	private url: string
	private file: any
	private hash: string
	private ext: string
	private objectName: string
	private frontId: string
	constructor(props) {
		const { filePath, ...parms } = props
		this.client = new OSS(parms)
		const time = new Date()
		this.filePath = filePath ?? `/tmp/${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}/`
		// this.filePath = `/tmp/`
		this.abortCheckpoint = 0
		this.progress = null
		this.url = ''
		this.hash = ''
		this.ext = ''
		this.objectName = ''
		this.frontId = `ossInstanceId-${Math.random()}`
	}

	stopUpload() {
		return this.client.cancel()
	}

	// 保存上传信息到后端接口
	ossUpload(data) {
		return ossUploadedHandler(data)
	}

	checkMd5(hash: string) {
		return checkHashHandler({ hash })
	}

	async upload(file: customFile, option: any = {}) {
		if (!file) return
		this.hash = await fileMd5(file)
		// 校验文件是否有上传过
		// const data: any = await
		return new Promise((resolve, reject) => {
			this.checkMd5(this.hash).then(
				(data: any) => {
					if (data) {
						resolve({
							...data,
							url: data.fullUrl,
							fakeFileId: file.fakeFileId,
						})
					} else {
						const { contentDisposition, ...retOptions } = option
						this.aliOssUpload(
							file,
							Object.assign(
								defaultConfig({
									contentDisposition,
								}),
								retOptions
							)
						).then(resolve, reject)
					}
				},
				(err) => {
					reject(err)
				}
			)
		})
	}

	async realUpload(option: any = {}) {
		const { backEnd = true, withFilename = false } = option

		if (withFilename) {
			const fileName = encodeURIComponent(this.file.name)
			option.headers['Content-Disposition'] = `attachment;filename="${fileName}"`
		}

		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.multipartUpload(this.url, this.file, {
					checkpoint: this.abortCheckpoint,
					parallel: 4,
					partSize: 1024 * 1024,
					progress: (p, cpt, res) => {
						// 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
						this.abortCheckpoint = cpt
						this.progress?.(p, cpt, res)
						// 获取上传进度。
					},
					...option,
				})
				const extra: any = {
					hash: this.hash,
					type: this.file.type,
					name: this.file.name,
					size: this.file.size,
					url: this.url,
				}
				if (this.file.videoWidth) {
					extra.videoWidth = this.file.videoWidth
					extra.videoHeight = this.file.videoHeight
					extra.videoScale = this.file.videoScale
				}
				backEnd
					? this.ossUpload(extra).then(
							(val: any) => {
								resolve({
									...val,
									fakeFileId: this.file.fakeFileId,
								})
							},
							() => {
								reject({ fakeFileId: this.file.fakeFileId })
							}
					  )
					: resolve({
							...extra,
							url: result.res?.requestUrls,
					  })
			} catch (e) {
				console.error('error-stop', e)
			}
		})
	}

	async aliOssUpload(file: customFile, option) {
		const { progress, isRandFileName = true, ...retPros } = option
		const ext = file.name ? file.name.slice(file.name.lastIndexOf('.') + 1) : ''
		this.objectName = isRandFileName ? randomid() + `.${ext}` : file.name
		const url = this.filePath + this.objectName // const url = this.filePath + file.name
		this.progress = progress
		this.url = url
		this.file = file
		this.ext = ext
		if (file.uploadVideoSize && /video\/(.*)/.test(file.type)) {
			// 测量视频尺寸
			const size = await getVideoSize(file)
			if (size) {
				const { width, height } = size
				this.file.videoWidth = width
				this.file.videoHeight = height
				this.file.videoScale = getVideoScale({ width, height })
			}
		}
		return this.realUpload(retPros)
	}

	getDownLoadUrl(name, filename) {
		const response = {
			'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`,
		}
		return this.client.signatureUrl(name, { response })
	}
}
