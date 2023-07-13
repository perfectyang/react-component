import { ts } from "@/language/translate";
import { Button, Tag } from "@arco-design/web-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import styles from "./index.module.less";

function pxToNumber(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

function createTag(tagList) {
  let str = "";
  for (let i = 0; i < tagList?.length; i++) {
    str +=
      '<div class="arco-tag arco-tag-arcoblue arco-tag-checkable arco-tag-size-small"><span class="arco-tag-content">' +
      tagList[i].channel +
      "</span></div>";
  }
  return str;
}

interface IProps {
  tags: Record<string, any>[];
  checked: number | undefined;
  onChecked: (item: any) => void;
  row?: number; // 超出多少行显示展开收起
}

const Ellipsis: React.FC<IProps> = ({ tags, checked, onChecked, row = 1 }) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [exceeded, setExceeded] = React.useState(false);
  const [tagList, setTagList] = React.useState<Record<string, any>[]>(
    tags ?? []
  );
  const [tagOriginList, setOriginTagList] = React.useState<
    Record<string, any>[]
  >(tags ?? []);
  const [expanded, setExpanded] = useState(false);
  const localTagListRef = React.useRef<Record<string, any>[]>([]);

  useEffect(() => {
    setTagList(tags);
    localTagListRef.current = tags;
    setOriginTagList(tags);
  }, [tags]);

  useEffect(() => {
    calcEllipsised();
  }, [rootRef.current, tags]);

  const calcEllipsised = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const originStyle = window.getComputedStyle(root);
    const container = document.createElement("div");
    const styleNames: string[] = Array.prototype.slice.apply(originStyle);
    styleNames.forEach((name) => {
      container.style.setProperty(name, originStyle.getPropertyValue(name));
    });
    container.style.position = "fixed";
    container.style.right = "9999px";
    container.style.top = "9999px";
    container.style.zIndex = "-1000";
    container.style.zIndex = "-10";
    container.style.height = "auto";
    container.style.minHeight = "auto";
    container.style.maxHeight = "auto";
    container.style.textOverflow = "clip";
    container.style.whiteSpace = "normal";
    container.style.webkitLineClamp = "unset";
    container.style.display = "block";
    const rows = row + 0.1;

    container.innerHTML = createTag(localTagListRef.current);
    document.body.appendChild(container);
    const text: HTMLDivElement | any = container.querySelector(".arco-tag");
    const computedStyle = getComputedStyle(text);
    const maxHeight = Math.floor(
      (text.offsetHeight + pxToNumber(computedStyle.marginBottom) + 1) * rows
    );

    if (container.offsetHeight <= maxHeight) {
      setExceeded(false);
      setTagList(() => {
        return localTagListRef.current.map((item) => item);
      });
    } else {
      setExceeded(true);
      const end = localTagListRef.current.length;
      const check = (left, right) => {
        if (right - left <= 1) {
          return left;
        }
        const middle = Math.round((left + right) / 2);
        container.innerHTML = createTag(
          localTagListRef.current.slice(0, middle)
        );
        if (container.offsetHeight < maxHeight) {
          return check(middle, right);
        } else {
          return check(left, middle);
        }
      };
      const target = check(0, end);
      setTagList(localTagListRef.current.slice(0, target));
    }
    document.body.removeChild(container);
  }, [tagList]);

  useLayoutEffect(() => {
    window.addEventListener("resize", calcEllipsised);
    return () => window.removeEventListener("resize", calcEllipsised);
  }, []);

  const renderContent = useMemo(() => {
    const tags = expanded ? tagOriginList : tagList;
    return tags?.map((tag, index) => (
      <Tag
        key={index}
        size="small"
        checkable
        color="arcoblue"
        checked={checked === tag.id}
        onCheck={() => {
          onChecked(tag);
        }}
      >
        <span key={index}>{tag.channel}</span>
      </Tag>
    ));
  }, [expanded, tagList, tagOriginList]);

  return (
    <>
      {tagList?.length ? (
        <>
          <div className={styles.container} ref={rootRef}>
            {renderContent}
            {exceeded && (
              <Button
                style={{ padding: 0, height: "auto", marginLeft: 6 }}
                onClick={() => {
                  const bool = !expanded ? true : false;
                  setExpanded(bool);
                }}
              >
                {!expanded ? ts("展开") : ts("收起")}
              </Button>
            )}
          </div>
        </>
      ) : (
        <div>no data</div>
      )}
    </>
  );
};

export default Ellipsis;
