/**
 * 可显示自定义行数，超出时显示省略号的文本组件
 */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import { getTextWidth, getFixedWidthText } from "./util";

interface EllipsisTextProps {
  text: string;
  lineNum?: number;
  textWeight?: number;
  buttonText?: string;
  buttonTextSize?: number;
  buttonTextWeight?: number;
  onClickButton?: (e: React.SyntheticEvent<any, Event>) => void;
  style?: Record<string, any>;
}

const ellipsis = "...";

const EllipsisText = (props: EllipsisTextProps) => {
  const {
    text = "", // 文本，必传
    lineNum = 1, // 行数
    buttonText, // 右下角按钮文字，不需要可不传,如果传了，则文本超出时才显示
    buttonTextSize = 12, // 右下角按钮字体大小
    buttonTextWeight = 400, // 右下角按钮字体粗细
    onClickButton, // 点击右下角按钮的回调
    style, // 组件样式
  } = props;
  let fontSize = 12;
  let textWeight = 400;
  if (style) {
    if (style.fontSize) {
      fontSize = parseInt(style.fontSize as string);
    }
    if (style.textWeight) {
      textWeight = Number(style.textWeight);
    }
  }

  const textRef = useRef<HTMLDivElement>(null);
  if (!text) return <div ref={textRef}></div>;

  const [width, setWidth] = useState(0);

  const data = useMemo(() => {
    let finalText = text;
    let isOver = false;
    const finalButtonTextSize = Math.max(buttonTextSize, 12);
    // 为了获取该组件的宽度，组件第一次render时按所有text文字显示
    if (width) {
      const sumWidth = width * lineNum;
      const str = getFixedWidthText(
        text,
        sumWidth,
        fontSize as number,
        textWeight
      );
      // 如果返回有省略号，说明文字超出了范围
      if (str.endsWith("...")) {
        isOver = true;
      }
      if (isOver) {
        const ellipticalTextWidth = getTextWidth(
          ellipsis,
          fontSize,
          textWeight
        );
        let buttonTextWidth = 0;
        if (buttonText) {
          buttonTextWidth = getTextWidth(
            buttonText,
            finalButtonTextSize,
            buttonTextWeight
          );
        }
        const sumWidth2 =
          width * lineNum - ellipticalTextWidth - buttonTextWidth;
        finalText = getFixedWidthText(
          text,
          sumWidth2 - 2,
          fontSize as number,
          textWeight
        );
      } else {
        finalText = text;
      }
    }
    return {
      textStyle: {
        fontSize: `${fontSize}px`,
        fontWeight: textWeight,
        wordBreak: "break-all",
        position: "relative",
        padding: 0,
        ...style,
      },
      finalText,
      isOver,
      buttonStyle: {
        fontSize: `${finalButtonTextSize}px`,
        fontWeight: buttonTextWeight.toString(),
        color: "#0076FF",
        cursor: "pointer",
        padding: 0,
        position: "absolute",
        right: 0,
      },
    };
  }, [width, lineNum, text, buttonText, buttonTextSize, style]);

  const resizeWidth = useCallback(() => {
    if (textRef.current) {
      const textNode = ReactDOM.findDOMNode(textRef.current) as HTMLDivElement;
      if (textNode) {
        setWidth(textNode.offsetWidth);
      } else {
        setWidth(0);
      }
    }
  }, []);

  useEffect(() => {
    // 组件didMound后获取组件的宽度
    resizeWidth();
  }, []);

  useEffect(() => {
    // 监听屏幕变化事件,修改组件的宽度
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  return (
    <div style={data.textStyle as Record<string, any>} ref={textRef}>
      {data.finalText}
      {buttonText && data.isOver && (
        <span
          style={data.buttonStyle as Record<string, any>}
          onClick={(e: React.SyntheticEvent<any, Event>) => {
            onClickButton && onClickButton(e);
          }}
        >
          {buttonText}
        </span>
      )}
    </div>
  );
};

export default EllipsisText;
