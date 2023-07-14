import { useReactive } from "ahooks";
import cls from "classnames";
import { useLayoutEffect, useMemo, useRef } from "react";
import "./index.less";
interface IProps {}
const EllipsisLabel: React.FC<IProps> = (props) => {
  const state = useReactive({
    labelList: [
      "人工智能",
      "人工智能与应用",
      "行业分析与市场数据报告行业分析与市场数据报告",
      "标签标签标签标签标签标签标签",
      "标签A",
      "啊啊啊",
      "宝宝贝贝",
      "微信",
      "吧啊啊",
      "哦哦哦哦哦哦哦哦",
      "人工智能",
      "人工智能与应用",
    ],
    isExpand: false,
    showExpandBtn: true,
    labelLength: 12,
    hideLength: 0,
  });
  const parentRef = useRef();

  const initData = () => {
    // const listCon = document.querySelector(".list-con-4");
    const listCon = parentRef.current;
    const labels = listCon?.querySelectorAll(".label:not(.expand-btn)");
    console.log("labels", labels);
    const firstLabelOffsetLeft = labels[0].getBoundingClientRect().left; // 第一个标签左侧偏移量
    const labelMaringRight = parseInt(
      window.getComputedStyle(labels[0]).marginRight
    );
    let line = 0; // 几行
    let labelIndex = 0; // 渲染第几个
    for (let i = 0; i < labels.length; i++) {
      const _offsetLeft = labels[i].getBoundingClientRect().left;
      if (firstLabelOffsetLeft === _offsetLeft) {
        line += 1;
      }
      if (line > 2) {
        state.showExpandBtn = true;
        labelIndex = i;
        // state.labelLength = state.hideLength
        break;
      } else {
        state.showExpandBtn = false;
      }
    }
    if (!state.showExpandBtn) {
      return;
    }
    setTimeout(() => {
      const listConRect = listCon.current.getBoundingClientRect();
      const expandBtn = listCon.current.querySelector(".expand-btn");
      const expandBtnWidth = expandBtn.getBoundingClientRect().width;
      for (let i = labelIndex - 1; i >= 0; i--) {
        console.log(labels[i]);
        const labelRight =
          labels[i].getBoundingClientRect().right - listConRect.left;
        console.log(labelRight, expandBtnWidth, labelMaringRight);
        if (
          labelRight + labelMaringRight + expandBtnWidth <=
          listConRect.width
        ) {
          state.hideLength = i + 1;
          state.labelLength = state.hideLength;
          break;
        }
      }
    });
  };

  const changeExpand = () => {
    state.isExpand = !state.isExpand;
    if (state.isExpand) {
      state.labelLength = state.labelList.length;
    } else {
      state.labelLength = state.hideLength;
    }
  };

  const renderTags = useMemo(() => {
    return state.labelList.slice(0, state.labelLength);
  }, [state.labelList, state.labelLength]);

  useLayoutEffect(() => {
    initData();
  }, []);

  return (
    <>
      <p className="title">
        样式二： 展开隐藏按钮和标签同级 - 通过计算行数判断
      </p>
      <div id="app4">
        <div
          ref={parentRef}
          className={cls("list-con list-con-4", {
            "list-expand": state.isExpand,
          })}
        >
          {renderTags.map((tag, idx) => {
            return (
              <div className="label" key={idx}>
                {tag}
              </div>
            );
          })}
          <div className="label expand-btn" onClick={changeExpand}>
            {!state.isExpand ? "展开 ▼" : "隐藏 ▲"}
          </div>
        </div>
      </div>
    </>
  );
};
export default EllipsisLabel;
