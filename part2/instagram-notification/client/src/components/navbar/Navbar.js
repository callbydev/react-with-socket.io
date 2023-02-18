import "./navbar.css";
import { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";

const Navbar = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className="navbar">
      <span className="logo">Instagram</span>
      <div className="icons">
        <div className="heart-container">
          {notifications.length > 0 && <span className="noti"></span>}
          <AiOutlineHeart size="20" className="heart" />
        </div>

        <HiOutlinePaperAirplane className="airplane" size="20" />
      </div>
    </div>
  );
};

export default Navbar;
