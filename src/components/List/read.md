### ------------- List

## value?: T[];

## multiple?: boolean; 单，多选

## cancelSelect?: boolean; 选中的选项是否可被取消

## onChange?: (val: T[]) => void; 回调函数返回结果，

## defaultValue?: any | null; 默认值

## ------------ListItem

## disabled?: boolean; 是否可以被点击

## value?: T; 是否可以被点击

### 例子:

```
const [value, setValue] = React.useStatus<number[]>([])
const demoList = React.useMemo(() => [
  {
    id: 1,
    val: '文字'
  }
], []);

<List<number>
  multiple={false}
  value={value}
  onChange={(val: number[]) => {
    setType(val);
  }}
>
  {demoList.map((txt) => (
    <ListItem value={txt.id} key={txt.id}>
      {(active, selectClick) => {
        return (
          <span className={cs({
            activeCls: active
          })} onClick={selectClick}>{txt.val}</span>
        );
      }}
    </ListItem>
  ))}
</List>
```
