import { ts } from '@/language/translate'
import { Link, Tag, TagProps } from '@arco-design/web-react'
import { hasValue } from '@util'
import React, { ReactNode, useCallback, useEffect, useLayoutEffect } from 'react'
import styles from './index.module.less'

function pxToNumber(value: string | null): number {
	if (!value) return 0
	const match = value.match(/^\d*(\.\d*)?/)
	return match ? Number(match[0]) : 0
}

function createTag(tagList) {
	let str = ''
	for (let i = 0; i < tagList?.length; i++) {
		str +=
			'<div class="arco-tag arco-tag-arcoblue arco-tag-checkable arco-tag-size-small" style="margin-right: 4px"><span class="arco-tag-content">' +
			tagList[i].label +
			'</span></div>'
	}
	return str
}

type IOption = string | number | undefined
type IOptionItem = { label: IOption; value: IOption; [key: string]: any }

type ItagProps = Omit<TagProps, 'onCheck'> & {
	onCheck?: (tag: IOptionItem) => void
}

interface IProps {
	options: IOptionItem[]
	value?: IOption[]
	onChange?: (value: IOption[] | undefined | IOption, options: IOptionItem[]) => void
	row?: number // 超出多少行显示展开收起, 默认一行
	mode?: 'single' | 'multiple' // 单选，还是多行
	tagProps?: ItagProps
	hasAll?: boolean // 是否包括'全部'的选项
	isClick?: boolean // 是否可点击
	extrNode?: ReactNode
	[key: string]: any
}

const Ellipsis: React.FC<IProps> = ({
	options,
	value,
	onChange,
	row = 1,
	mode = 'single',
	tagProps = {},
	hasAll = true,
	isClick = true,
	extrNode,
}) => {
	const rootRef = React.useRef<HTMLDivElement>(null)
	const [exceeded, setExceeded] = useSafeState(false)
	const [tagList, setTagList] = useSafeState<IOptionItem[]>([])
	const [tagOriginList, setOriginTagList] = useSafeState<IOptionItem[]>([])
	const [expanded, setExpanded] = useSafeState(false)
	const [selected, setSelected] = useSafeState<IOption[]>([])

	useEffect(() => {
		// 单多选逻辑统一格式
		let _v
		if (hasValue(value)) {
			_v = Array.isArray(value) ? value : [value]
		} else {
			_v = [undefined]
		}
		setSelected(_v)
	}, [value])

	const localTagListRef = useRef<IOptionItem[]>([])

	useEffect(() => {
		const _options = options?.slice(0) ?? []
		if (hasAll) {
			_options.unshift({
				label: ts('全部'),
				value: undefined,
			})
		}
		setTagList([..._options])
		localTagListRef.current = [..._options]
		setOriginTagList([..._options])
		if (_options.length) {
			calcEllipsised()
		}
	}, [options, hasAll])

	const calcEllipsised = useCallback(() => {
		const root = rootRef.current
		if (!root) return
		const originStyle = window.getComputedStyle(root)
		const container = document.createElement('div')
		const styleNames: string[] = Array.prototype.slice.apply(originStyle)
		styleNames.forEach((name) => {
			container.style.setProperty(name, originStyle.getPropertyValue(name))
		})
		container.style.position = 'fixed'
		container.style.right = '9999px'
		container.style.top = '9999px'
		container.style.zIndex = '-1000'
		container.style.height = 'auto'
		container.style.minHeight = 'auto'
		container.style.maxHeight = 'auto'
		container.style.textOverflow = 'clip'
		container.style.whiteSpace = 'normal'
		container.style.webkitLineClamp = 'unset'
		container.style.display = 'block'
		const rows = row

		container.innerHTML = createTag(localTagListRef.current)
		document.body.appendChild(container)
		const text: HTMLDivElement | any = container.querySelector('.arco-tag')
		const computedStyle = getComputedStyle(text)
		// 设置高度标准，超过就截取
		const maxHeight = Math.floor(
			(text.offsetHeight + pxToNumber(computedStyle.marginBottom) + 4) * rows
		)

		if (container.offsetHeight <= maxHeight) {
			setExceeded(false)
			setTagList(() => {
				return localTagListRef.current.map((item) => item)
			})
		} else {
			setExceeded(true)
			const end = localTagListRef.current.length
			const check = (left, right) => {
				if (right - left <= 1) {
					return left
				}
				const middle = Math.round((left + right) / 2)
				container.innerHTML = createTag(localTagListRef.current.slice(0, middle))
				if (container.offsetHeight < maxHeight) {
					return check(middle, right)
				} else {
					return check(left, middle)
				}
			}
			const target = check(0, end)
			setTagList(localTagListRef.current.slice(0, target - 1))
		}
		document.body.removeChild(container)
	}, [tagList])

	useLayoutEffect(() => {
		window.addEventListener('resize', calcEllipsised)
		return () => window.removeEventListener('resize', calcEllipsised)
	}, [])

	const renderContent = useMemo(() => {
		const tags = expanded ? tagOriginList : tagList
		return tags ? (
			tags.map((tag, idx) => (
				<Tag
					key={`${tag.value}-${idx}`}
					size="small"
					checkable
					color="#165dff"
					checked={selected?.includes?.(tag.value)}
					style={{ marginRight: 4, marginBottom: 4, borderRadius: '10px' }}
					{...tagProps}
					onCheck={() => {
						if (!isClick) return
						const isSelected = selected?.includes?.(tag.value)
						if (mode === 'single' && isSelected) {
							// 单选逻辑，已经是选中状态，再次点击就不会触发值变动
							return
						}
						if (mode === 'multiple' && tag.value === undefined && isSelected) {
							// 多选逻辑，"全部选项"不可能再次反选
							return
						}
						if (!isSelected) {
							tagProps.onCheck?.(tag)
						}
						setSelected((pre) => {
							if (mode === 'single') {
								// 单选
								onChange?.(tag.value !== undefined ? tag.value : undefined, [{ ...tag }])
								return tag.value !== undefined ? [tag.value] : [undefined]
							} else {
								// 多选
								let _newData = [...pre]
								if (_newData.includes(tag.value)) {
									_newData = _newData.filter((key) => key !== tag.value)
								} else {
									_newData = [..._newData, tag.value]
								}
								const originOption = tagOriginList.filter((cur) => _newData.includes(cur.value))
								if (tag.value === undefined) {
									// 选了全部
									onChange?.([undefined], [{ ...tag }])
									return [undefined]
								} else {
									const _data = _newData.filter((cur) => cur !== undefined)
									const isResetAll = _data.length === 0 && tag.value !== undefined
									const ret = isResetAll ? [undefined] : _data
									onChange?.(
										ret,
										isResetAll
											? [{ ...tag }]
											: originOption.filter((cur) => cur.value !== undefined)
									)
									return ret
								}
							}
						})
					}}
				>
					<span key={tag.value}>{tag.label}</span>
				</Tag>
			))
		) : (
			<></>
		)
	}, [expanded, tagList, tagOriginList, selected, onChange])

	return (
		<>
			{tagList?.length ? (
				<>
					<div className={styles.container} ref={rootRef}>
						{renderContent}
						{exceeded && (
							<Link
								style={{ padding: 0, height: 'auto', cursor: 'pointer', marginLeft: 4 }}
								onClick={() => {
									const bool = !expanded ? true : false
									setExpanded(bool)
								}}
							>
								{!expanded ? ts('展开') : ts('收起')}
							</Link>
						)}
						{extrNode}
					</div>
				</>
			) : (
				<></>
			)}
		</>
	)
}

export default Ellipsis
