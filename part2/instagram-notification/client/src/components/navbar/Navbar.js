import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { socket } from "../../socket";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;
    function getNofi(data) {
      setNotifications((prev) => [...prev, data]);
    }
    socket.on("getNotification", getNofi);

    return () => {
      socket.off("getNotification", getNofi);
    };
  }, []);

  return (
    <div className={styles.navbar}>
      <span className={styles.logo}>Instagram</span>
      <div className={styles.icons}>
        <div className={styles.heartContainer}>
          {notifications.length > 0 && <span className={styles.noti}></span>}
          <AiOutlineHeart size="20" className={styles.heart} />
          {notifications.length > 0 && (
            <div className={styles.likeBubble}>
              <AiFillHeart size="15" color="#fff" />{" "}
              <div className={styles.count}>{notifications.length}</div>
            </div>
          )}
        </div>

        <HiOutlinePaperAirplane className={styles.airplane} size="20" />
      </div>
    </div>
  );
};

export default Navbar;
