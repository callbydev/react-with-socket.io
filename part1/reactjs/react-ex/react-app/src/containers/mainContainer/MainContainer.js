import React, { useState } from "react";
import styles from "./MainContainer.module.css";
import { IoAddCircleSharp } from "react-icons/io5";
import dayjs from "dayjs";

const MainContainer = () => {
  const [memoData, setMemoData] = useState(new Map());
  const dateList = Array.from(memoData.keys());
  const onAddDateHandler = () => {
    const currentDate = dayjs().format("YYYY.MM.DD HH:mm:ss");
    if (memoData.has(currentDate)) return;
    setMemoData((prev) => new Map(prev).set(currentDate, []));
  };
  console.log(dateList);
  return (
    <div className={styles.memoContainer}>
      <div className={styles.memoWrap}>
        <nav className={styles.sidebar}>
          <ul className={styles.dateList}>
            {dateList.map((v) => (
              <li className={styles.li} key={v}>
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
        <section className={styles.content}></section>
      </div>
    </div>
  );
};

export default MainContainer;
