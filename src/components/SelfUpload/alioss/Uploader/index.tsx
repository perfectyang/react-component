import { usePropsValue } from '@/utils/native-props'
import { IconPlus } from '@arco-design/web-react/icon'
import pick from 'lodash/pick'
import PictureCard from '../UploadItem/PictureCard'
import { parallelAsync } from '../utils/parallelAsync'
import { genrateRandom } from '../utils/index'
import { UPLOADSTATUS } from './type'
import TextCard from '../UploadItem/TextCard'
import { hasValue } from '@util'

export default function Uploader(props) {
	const {
		limit,
		onExceedLimit,
		listType = 'picture-card',
		download,
		// contentDisposition 该字段代表是否上传资源能在线查看 attachment 下载，inline在线查看
		contentDisposition = 'attachment',
		withFilename = false,
		tipText,
		...retProps
	} = props

	const _limit = useMemo(() => {
		if (!retProps.multiple) {
			return 1
		} else {
			if (hasValue(limit)) {
				return limit
			} else {
				return Infinity
			}
		}
	}, [limit, retProps.multiple])

	const [files, setFiles] = usePropsValue({
		value: hasValue(props.value) ? props.value : [],
		onChange: props.onChange,
		defaultValue: [],
	})

	const fileRef = useRef<HTMLInputElement>(null)
	const fileInstanceMap = useRef(new Map())
	const removeFile = (curFile, idx?) => {
		setFiles((list) => {
			let _i = idx
			const tmp = list.slice()
			if (!hasValue(_i)) {
				const tmpIdx = tmp.findIndex((cur) => cur.fakeFileId === curFile.fakeFileId)
				if (tmpIdx > -1) {
					_i = tmpIdx
				}
			}
			tmp.splice(_i, 1)
			return [...tmp]
		})
	}

	const resolveSuccess = useMemoizedFn((file) => {
		setFiles((list) => {
			const idx = list.findIndex((pt) => {
				return pt.fakeFileId === file.fakeFileId
			})
			if (idx > -1) {
				const newItem = list[idx]
				list.splice(idx, 1, {
					...newItem,
					...file,
					url: file.fullUrl,
					percent: 100,
					status: UPLOADSTATUS.DONE,
				})
			}
			return [...list]
		})
	})

	const updateFile = useMemoizedFn(({ file, cb }) => {
		setFiles((list) => {
			const itemFile = list.find((pt) => pt.fakeFileId === file.fakeFileId)
			if (itemFile) {
				cb(itemFile)
			}
			return [...list]
		})
	})

	const onStop = useMemoizedFn((file) => {
		const instance = fileInstanceMap.current.get(file.fakeFileId)
		instance.stopUpload()
		updateFile({
			file,
			cb: (targetFile) => {
				targetFile.status = UPLOADSTATUS.PAUSE
			},
		})
	})

	const onPlay = useMemoizedFn((file) => {
		const instance = fileInstanceMap.current.get(file.fakeFileId)
		instance.realUpload().then(resolveSuccess, removeFile)
	})

	const fileOnChange = (e) => {
		const tmpFiles = Array.from(e?.target?.files)
		if (_limit < files.length + tmpFiles.length) {
			return onExceedLimit && onExceedLimit(tmpFiles, files)
		}

		setFiles((prevFiles) => {
			tmpFiles.forEach((curFile: any) => {
				curFile.fakeFileId = curFile.fakeFileId ?? genrateRandom()
				curFile.status = UPLOADSTATUS.PENDING
				parallelAsync((instance: any) => {
					fileInstanceMap.current.set(curFile.fakeFileId, instance)
					return instance
						.upload(curFile, {
							progress: (percent: number) => {
								updateFile({
									file: curFile,
									cb: (targetFile) => {
										targetFile.percent = Number(percent * 100).toFixed(2)
										targetFile.status = UPLOADSTATUS.UPLOADING
									},
								})
							},
							contentDisposition,
							withFilename,
						})
						.then(resolveSuccess, removeFile)
				})
			})
			return [...prevFiles, ...tmpFiles]
		})
		if (fileRef.current) {
			fileRef.current.value = ''
		}
	}
	const defaultConfig = useMemo(() => {
		return Object.assign(
			{
				multiple: false,
				accept: 'image/*,audio/*,video/*,',
			},
			pick(props, ['accept', 'multiple'])
		)
	}, [props])

	const targetNode = useMemo(() => {
		const bool = files.length < _limit
		return bool ? (
			<>
				<div
					onClick={() => {
						fileRef.current?.click()
					}}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						cursor: 'pointer',
					}}
				>
					<IconPlus />
				</div>
			</>
		) : null
	}, [defaultConfig, files, _limit])

	return (
		<div>
			{listType === 'picture-card' && (
				<PictureCard
					fileList={files}
					onRemove={removeFile}
					onStop={onStop}
					onPlay={onPlay}
					uploadIcon={targetNode}
					download={download}
					onChange={setFiles}
					tipText={tipText}
				/>
			)}
			{listType === 'text' && (
				<TextCard
					fileList={files}
					onRemove={removeFile}
					onStop={onStop}
					onPlay={onPlay}
					uploadIcon={targetNode}
					tipText={tipText}
				/>
			)}
			<input
				ref={fileRef}
				style={{ display: 'none' }}
				onChange={(file) => fileOnChange(file)}
				{...defaultConfig}
				type="file"
				onClick={(e) => {
					e.stopPropagation()
				}}
			/>
		</div>
	)
}
