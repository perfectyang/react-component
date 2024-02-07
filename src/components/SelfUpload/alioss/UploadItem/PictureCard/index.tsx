import { classNames, hasValue } from '@util'
import {
	IconDelete,
	IconDownload,
	IconEye,
	IconPause,
	IconPlayArrow,
} from '@arco-design/web-react/icon'
import { Progress, Space, Spin } from '@arco-design/web-react'
import AUDIO_ICON from '@ass/images/audio.png'
// import { VIDEO_PREVIEW_SUFFIX } from '../../config/form'
import styles from './index.module.less'
import { openImage, previewVideo } from '@/components/biz/hooks/mediaUtil'
import { VIDEO_PREVIEW_SUFFIX } from '@/utils/mimeType'
import { UPLOADSTATUS } from '../../Uploader/type'
import { downLoadOss, openLink } from '@/utils/dom'
import SelfTooltip from '@/components/biz/SelfTooltip'
import psdLogo from '@/assets/images/psd.png'
import Pdf from '@/assets/svgIcon/Pdf.svg'
import Draggable from '@/components/biz/Draggable'
import { ReactNode } from 'react'

const IconHandler = ({ onStop, onPlay, item }) => {
	const state = useReactive({
		isUploading: true,
	})

	return state.isUploading ? (
		<IconPause
			style={{ color: '#fff', fontSize: 28 }}
			onClick={(e) => {
				state.isUploading = !state.isUploading
				e.stopPropagation()
				onStop?.(item)
			}}
		/>
	) : (
		<IconPlayArrow
			style={{ color: '#fff', fontSize: 28 }}
			onClick={(e) => {
				state.isUploading = !state.isUploading
				e.stopPropagation()
				onPlay?.(item)
			}}
		/>
	)
}
interface IPictureCard {
	fileList: any[]
	onRemove?: (val: any, idx: number) => void
	onStop?: (val: any) => void
	onPlay?: (val: any) => void
	onChange?: (val: any) => void
	uploadIcon?: ReactNode
	tipText?: ReactNode
	download?: boolean
	isDelete?: boolean
}

const PictureCard = ({
	fileList,
	onRemove,
	onStop,
	onPlay,
	uploadIcon,
	download,
	onChange,
	isDelete = true,
	tipText,
}: IPictureCard) => {
	const handlePreview = (item) => {
		if (item?.mimeType?.indexOf('video') >= 0 || item?.mimeType?.indexOf('audio') >= 0) {
			previewVideo({
				srcList: [
					{
						fullUrl: item.fullUrl,
					},
				],
			})
		} else if (item?.mimeType?.indexOf('application') >= 0) {
			openLink(item.fullUrl)
		} else {
			const list = fileList.filter(
				(cur) => !['video', 'audio', 'application'].some((t) => cur?.mimeType?.indexOf(t) >= 0)
			)
			const targetIndx = list.findIndex((it) => it.fullUrl === item?.fullUrl)
			openImage({
				srcList: list.map((cur) => {
					return cur?.suffix === 'psd' ? psdLogo : cur.fullUrl
				}),
				defaultCurrent: targetIndx,
			})
		}
	}

	const fileTemplate = fileList?.filter(hasValue)?.map((item, idx) => {
		let imgUrl: any = ''
		if (item?.mimeType?.indexOf('audio') >= 0) {
			imgUrl = AUDIO_ICON
		} else if (item?.mimeType?.indexOf('video') >= 0) {
			imgUrl = `${item.fullUrl}${VIDEO_PREVIEW_SUFFIX}`
		} else {
			imgUrl = item.fullUrl
		}
		if (item?.suffix === 'psd') {
			imgUrl = psdLogo
		}
		if (item?.suffix === 'pdf') {
			imgUrl = Pdf
		}
		return (
			<div
				key={item.fakeFileId || item.uid}
				className={classNames(styles.materialCard)}
				title={item.name}
				onClick={() => handlePreview(item)}
			>
				{imgUrl && <img src={imgUrl} className={classNames(styles.img)} />}
				{[UPLOADSTATUS.PAUSE, UPLOADSTATUS.UPLOADING].includes(item.status) && (
					<>
						<div className={styles.title}>{item.name}</div>
						{UPLOADSTATUS.PAUSE === item.status && (
							<p className={styles.pause}>
								<IconPause />
							</p>
						)}
						<Progress
							type="circle"
							percent={Number(item.percent)}
							animation
							size="small"
							style={{ marginLeft: '15px', marginBottom: 10 }}
						/>
					</>
				)}
				{item.status === UPLOADSTATUS.PENDING && <Spin size={10} dot />}
				<div className={classNames(styles.mask)}>
					<Space size={4}>
						{[UPLOADSTATUS.PAUSE, UPLOADSTATUS.UPLOADING].includes(item.status) && (
							<IconHandler onStop={onStop} onPlay={onPlay} item={item} />
						)}
						{([UPLOADSTATUS.DONE].includes(item.status) || !hasValue(item.status)) && (
							<>
								<IconEye
									style={{ marginRight: 4, color: '#fff' }}
									onClick={(e) => {
										e.stopPropagation()
										handlePreview(item)
									}}
								/>
								{download && (
									<IconDownload
										style={{ marginRight: 4, color: '#fff' }}
										onClick={(e) => {
											e.stopPropagation()
											const url = item.fullUrl?.replace(/(http:|https:)/g, '')
											const newUrl = new URL('http:' + url)
											downLoadOss(newUrl.pathname, item.originName ?? Math.random())
										}}
									/>
								)}
								{isDelete && (
									<IconDelete
										style={{ color: '#fff' }}
										onClick={(e) => {
											e.stopPropagation()
											onRemove?.(item, idx)
										}}
									/>
								)}
							</>
						)}
					</Space>
				</div>
				{(item.status === UPLOADSTATUS.DONE || !item.status) && (
					<p className={styles.title}>
						<SelfTooltip title={item.originName} />
					</p>
				)}
			</div>
		)
	})

	return (
		<>
			<div className={styles.container}>
				{onChange ? (
					<>
						<Draggable direction="horizontal" value={fileList} onChange={onChange}>
							{fileTemplate}
							{uploadIcon && <div className={styles.materialCard}>{uploadIcon}</div>}
						</Draggable>
					</>
				) : (
					<>
						{fileTemplate}

						{uploadIcon && <div className={styles.materialCard}>{uploadIcon}</div>}
					</>
				)}
			</div>
			{tipText && <div style={{ wordBreak: 'break-word', color: '#c6c6c6' }}>{tipText}</div>}
		</>
	)
}
export default PictureCard
