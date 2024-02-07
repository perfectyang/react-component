import Upload, { UploadProps } from '@arco-design/web-react/es/Upload'
import { hasValue, removeDuplicates } from '@util'
import { openDialog } from '../biz/hooks/useDialog'
import { runPromise } from './alioss'

const genrateRandom = () => Math.random().toString(36).substring(2)
type IProps = UploadProps
const markUid = (list) => {
	return Array.from(list ?? [])?.map((cur: any) => {
		const cmp: Record<string, any> = { ...cur }
		if (!cmp.uid) {
			cmp.uid = `${cmp.fullUrl}${cmp.id}${cmp.hash}`
		}
		if (!hasValue(cmp.name)) {
			cmp.name = cmp.originName
		}
		const url = cmp?.url?.startsWith('//') ? cmp.url : cmp.fullUrl
		cmp.url = url
		return cmp
	})
}

const FileUpload: React.FC<IProps> = memo((props: any) => {
	// contentDisposition 该字段代表是否上传资源能在线查看 attachment 下载，inline在线查看
	const {
		children,
		// extra,
		filesChange,
		contentDisposition = 'attachment',
		withFilename = false,
		isDelTip = false,
		uploadVideoSize = true,
		...rest
	} = props
	const [fileList, setFileList] = useState<any[]>(markUid(props.fileList) ?? [])
	const storeList = useRef<any[]>(markUid(props.fileList) ?? [])
	useEffect(() => {
		const tmpValue = props.value
		if (tmpValue) {
			setFileList(markUid([...tmpValue]))
			storeList.current = markUid([...tmpValue])
		} else {
			setFileList([])
			storeList.current = []
		}
	}, [props.value])

	useEffect(() => {
		if (!props.fileList) return

		setFileList(markUid(props.fileList))
		storeList.current = markUid(props.fileList)
	}, [props.fileList])

	const attrProps: any = {
		imagePreview: true,
		autoUpload: true,
		...rest,
		fileList,
		onChange: (files: any, currentFile: any) => {
			setFileList([...files])
		},
		beforeUpload: (file) => {
			file.id = genrateRandom()
			file.uploadVideoSize = uploadVideoSize
			return new Promise((resolve) => {
				resolve(true)
			})
		},
		onRemove: (file: any) => {
			const handleDel = () => {
				const idx = storeList.current.findIndex((item: any) => item.id == file.id)
				if (idx > -1) {
					storeList.current.splice(idx, 1)
				}
				setFileList([...storeList.current])
				props.onChange?.([...storeList.current])
				filesChange?.([...storeList.current])
			}
			if (!isDelTip) {
				handleDel()
				return Promise.resolve('')
			} else {
				return new Promise((resolve, reject) => {
					openDialog({
						title: '提示',
						style: {
							width: '200px',
						},
						content: <div style={{ padding: '10px', textAlign: 'center' }}>你确定要删除吗?</div>,
						onOk: async () => {
							handleDel()
							resolve('')
						},
						onCancel: () => reject(),
					})
				})
			}
		},
		customRequest: async (options: any) => {
			const { onProgress, onError, onSuccess, file } = options
			runPromise((instance: any) => {
				const curInstance = instance
				try {
					curInstance
						.upload(file, {
							progress: (percent: number, cpt, res) => {
								onProgress((percent * 100).toFixed(2), file)
							},
							contentDisposition,
							withFilename,
						})
						.then(
							(data) => {
								const currFile = {
									uid: file.id,
									...data,
									name: file.name,
									percent: 100,
									status: 'done',
									url: data.fullUrl,
								}
								if (props.multiple) {
									storeList.current.push(currFile)
								} else {
									storeList.current = [currFile]
								}
								onSuccess(currFile)
								let realImages = removeDuplicates([...storeList.current], (c) => c.fullUrl)
								if (props.limit) {
									realImages = realImages.slice(0, props.limit)
								}
								setFileList(realImages)
								props.onChange?.(realImages)
								filesChange?.(realImages)
							},
							(err) => {
								onError(err)
							}
						)
				} catch (error) {
					onError(error)
				}
			})
		},
		onProgress: (file, e) => {
			setFileList((v) => {
				return v.map((x) => {
					return x.uid === file.uid ? file : x
				})
			})
		},
	}
	delete attrProps.action

	return <Upload {...attrProps}>{children}</Upload>
})

export default FileUpload
