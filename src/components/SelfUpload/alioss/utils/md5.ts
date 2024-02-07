import SparkMD5 from 'spark-md5'

/**
 * 计算文件Md5
 * 将文件分片逐步计算最终合并得出整个文件md5, 提升计算速度
 * @param {*} file
 */

export default function computeFileMD5(file): Promise<string> {
	return new Promise((resolve, reject) => {
		const pro = File.prototype as any
		const blobSlice = pro.slice || pro.mozSlice || pro.webkitSlice
		const chunkSize = 2097152 // 按照一片 2MB 分片
		const chunks = Math.ceil(file.size / chunkSize) // 片数
		let currentChunk = 0
		const spark = new SparkMD5.ArrayBuffer()
		const fileReader = new FileReader()

		fileReader.onload = function (e: any) {
			spark.append(e.target.result)
			currentChunk++

			if (currentChunk < chunks) {
				loadNext()
			} else {
				const md5 = spark.end() //最终md5值
				spark.destroy() //释放缓存
				resolve(md5)
			}
		}

		fileReader.onerror = function (e) {
			reject(e)
		}

		function loadNext() {
			const start = currentChunk * chunkSize
			const end = start + chunkSize >= file.size ? file.size : start + chunkSize
			fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
		}

		loadNext()
	})
}
