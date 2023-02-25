import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import styles from "./seatContainer.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SeatContainer = () => {
  const { id, title } = useParams();
  const socketIo = useRef(null);
  const [seats, setSeats] = useState([
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  ]);

  useEffect(() => {
    socketIo.current = io("http://localhost:5000");
  }, []);

  return (
    <div className={cx("seat_container")}>
      <h2 className={cx("title")}>{title}</h2>
      <div className={cx("screen")}>screen</div>
      <ul className={cx("wrap_seats")}>
        {seats.map((v) => {
          return v.map((i, idx) => (
            <li
              key={`seat_${idx}`}
              className={cx("seat", i === 0 && "empty")}
            ></li>
          ));
        })}
      </ul>
    </div>
  );
};
export default SeatContainer;
