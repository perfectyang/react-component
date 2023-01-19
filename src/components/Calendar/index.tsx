import React, { useRef } from "react";
import {
  nextWeekLogic,
  prevWeekLogic,
  renderText,
  restTodayPosition,
  ut,
} from "./utils";
import "./index.less";

interface IRef {}

interface IProps {
  [key: string]: any;
}

const Calendar = React.forwardRef<IRef, IProps>((props, ref) => {
  const date = ut.DateTime();
  const [vals, setVals] = React.useState<any>({});
  const [days, setDays] = React.useState<any[]>([]);

  const weeks: string[] = [
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
    "周日",
  ];

  const todayDateRef = useRef({
    y: date.GetYear(),
    m: date.GetMonth(),
    d: date.GetDate(),
  });

  const randomId = () => Math.random().toString(36).substring(2);

  React.useImperativeHandle(ref, () => ({}));

  // 上一周
  const prevWeek = () => {
    setDays((days) => {
      const curDays = [...prevWeekLogic(days)];
      props.prevWeek?.(curDays);
      return [...curDays];
    });
  };

  // 下一周
  const nextWeek = () => {
    setDays((days) => {
      const curDays = [...nextWeekLogic(days)];
      props.nextWeek?.(curDays);
      return [...curDays];
    });
  };

  // 初始化处理
  const initData = (toDate) => {
    const realCalendar = restTodayPosition(toDate);
    setDays(realCalendar);
    return realCalendar;
  };

  const pageCalendar = () => {
    return (
      <>
        <span onClick={prevWeek}>上一周</span>
        <span onClick={nextWeek}>下一周</span>
      </>
    );
  };

  const renderDate = () => {
    return [
      todayDateRef.current.y + "年",
      todayDateRef.current.m + "月",
      todayDateRef.current.d + "日",
    ];
  };
  const weekRender = () => {
    return (
      <>
        {weeks.map((item, idx) => {
          return (
            <div className="calendar-cell-week" key={idx}>
              <p>{item}</p>
            </div>
          );
        })}
      </>
    );
  };
  const dayRender = () => {
    return (
      <>
        {days.map((item) => {
          const dateRender =
            props.dateRender &&
            props.dateRender({ y: item.y, m: item.m, d: item.d });
          return (
            <div
              className={item.cls}
              key={randomId()}
              onClick={() => {
                // checkDate({ y: item.y, m: item.m, d: item.d });
              }}
            >
              <p>
                <span className="text">{renderText(item)}</span>
              </p>
              <main>{dateRender}</main>
            </div>
          );
        })}
      </>
    );
  };

  const checkDate = ({ y, m, d }) => {
    const ymd = { y, m, d };
    setVals(ymd);
    props.onChange && props.onChange(ymd);
  };

  React.useEffect(() => {
    const toDate = {
      y: todayDateRef.current.y,
      m: todayDateRef.current.m,
      d: todayDateRef.current.d,
    };
    console.log("toDate", toDate);
    initData(toDate);
    setVals(toDate);
  }, []);

  return (
    <div className="calendar  self-calendar">
      <div className="calendar-header ">
        <span className="date-show">{renderDate()}</span>
        <span
          style={{ width: 100, marginRight: "10px" }}
          onClick={() => {
            const days = initData({
              y: todayDateRef.current.y,
              m: todayDateRef.current.m,
              d: todayDateRef.current.d,
            });
            props.todayClick?.(days);
          }}
        >
          今天
        </span>
        {pageCalendar()}
      </div>
      <div style={{ width: "80%", margin: "10px auto" }}>
        <div className="calendar-body ">
          <div className="calendar-month  month-border">
            <div className="calendar-week ">{weekRender()}</div>
            <div className="calendar-body ">{dayRender()}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Calendar;
