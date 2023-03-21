import React, { useState, useRef } from "react";
import styles from "./MainContainer.module.css";
import { IoAddCircleSharp } from "react-icons/io5";
import dayjs from "dayjs";
import { Input, Goal } from "../../components";

const MainContainer = () => {
  const [memoData, setMemoData] = useState(new Map());
  const [currentDate, setCurrentDate] = useState("");
  const [goalMsg, setGoalMsg] = useState("");
  const onAddDateHandler = () => {
    const tempCurrentDate = dayjs().format("YYYY.MM.DD HH:mm:ss");
    if (memoData.has(tempCurrentDate)) return;
    setCurrentDate(tempCurrentDate);
    setMemoData((prev) => new Map(prev).set(tempCurrentDate, []));
  };
  const onDateClick = (e) => {
    const { id } = e.target.dataset;
    setCurrentDate(id);
  };
  const onMsgClickHandler = (e) => {
    e.preventDefault();
    const newGoalList = memoData.get(currentDate);
    setMemoData((prev) =>
      new Map(prev).set(currentDate, [
        ...newGoalList,
        { msg: goalMsg, status: false },
      ])
    );
    setGoalMsg("");
  };
  const onChangeMsgHandler = (e) => {
    setGoalMsg(e.target.value);
  };
  const onCheckChange = (e) => {
    console.log(e.target.checked);
  };
  console.log(memoData);
  return (
    <div className={styles.memoContainer}>
      <div className={styles.memoWrap}>
        <nav className={styles.sidebar}>
          <ul className={styles.dateList}>
            {Array.from(memoData.keys()).map((v) => (
              <li
                className={styles.li}
                key={v}
                data-id={v}
                onClick={onDateClick}
              >
                {v}
              </li>
            ))}
          </ul>
          <div className={styles.addWrap}>
            <IoAddCircleSharp
              size="50"
              color="#fff"
              onClick={onAddDateHandler}
            />
          </div>
        </nav>
        <section className={styles.content}>
          {memoData.size > 0 && (
            <>
              <ul className={styles.goals}>
                {memoData.get(currentDate).map((v, i) => (
                  <li key={`goal_${i}`}>
                    <Goal
                      msg={v.msg}
                      status={true}
                      onCheckChange={onCheckChange}
                    />
                  </li>
                ))}
              </ul>
              <Input
                value={goalMsg}
                onClick={onMsgClickHandler}
                onChange={onChangeMsgHandler}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MainContainer;
