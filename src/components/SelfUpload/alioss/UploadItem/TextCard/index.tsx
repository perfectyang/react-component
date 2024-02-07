import { classNames, hasValue } from '@util'
import { IconDelete, IconEye, IconPause, IconPlayArrow } from '@arco-design/web-react/icon'
import { Progress, Space, Spin } from '@arco-design/web-react'
import AUDIO_ICON from '@ass/images/audio.png'
// import { VIDEO_PREVIEW_SUFFIX } from '../../config/form'
import styles from './index.module.less'
import { openImage, previewVideo } from '@/components/biz/hooks/mediaUtil'
import { VIDEO_PREVIEW_SUFFIX } from '@/utils/mimeType'
import { UPLOADSTATUS } from '../../Uploader/type'

const IconHandler = ({ onStop, onPlay, item }) => {
	const state = useReactive({
		isUploading: true,
	})

	return state.isUploading ? (
		<IconPause
			style={{ color: '#fff', fontSize: 28 }}
			onClick={() => {
				state.isUploading = !state.isUploading
				onStop?.(item)
			}}
		/>
	) : (
		<IconPlayArrow
			style={{ color: '#fff', fontSize: 28 }}
			onClick={() => {
				state.isUploading = !state.isUploading
				onPlay?.(item)
			}}
		/>
	)
}

const UploadItem = ({ fileList, onRemove, onStop, onPlay, uploadIcon }) => {
	const handlePreview = (item) => {
		if (item?.mimeType?.indexOf('video') >= 0 || item?.mimeType?.indexOf('audio') >= 0) {
			previewVideo({
				srcList: [
					{
						fullUrl: item.fullUrl,
					},
				],
			})
		} else {
			openImage({ src: item.fullUrl })
		}
	}

	return (
		<div className={styles.container}>
			{fileList.map((item) => {
				let imgUrl = ''
				if (item?.mimeType?.indexOf('audio') >= 0) {
					imgUrl = AUDIO_ICON
				} else if (item?.mimeType?.indexOf('video') >= 0) {
					imgUrl = `${item.fullUrl}${VIDEO_PREVIEW_SUFFIX}`
				} else {
					imgUrl = item.fullUrl
				}
				return (
					<div className="arco-upload-list arco-upload-list-type-text" key={item.fakeFileId}>
						{[UPLOADSTATUS.PAUSE, UPLOADSTATUS.UPLOADING].includes(item.status) && (
							<>
								<p className={styles.title}>{item.name}</p>
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
											onClick={() => handlePreview(item)}
										/>
										<IconDelete style={{ color: '#fff' }} onClick={() => onRemove?.(item)} />
									</>
								)}
							</Space>
						</div>
					</div>
				)
			})}
			<div className={styles.materialCard}>{uploadIcon}</div>
		</div>
	)
}

export default UploadItem
