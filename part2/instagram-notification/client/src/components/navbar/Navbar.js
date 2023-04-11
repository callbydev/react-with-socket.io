import { useEffect, useState } from "react";
import "./navbar.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { socket } from "../../socket";

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
        <div className="navbar">
            <span className="logo">Instagram</span>
            <div className="icons">
                <div className="heart-container">
                    {notifications.length > 0 && <span className="noti"></span>}
                    <AiOutlineHeart size="20" className="heart" />
                    {notifications.length > 0 && (
                        <div className="like-bubble">
                            <AiFillHeart size="15" color="#fff" />{" "}
                            <div className="count">{notifications.length}</div>
                        </div>
                    )}
                </div>

                <HiOutlinePaperAirplane className="airplane" size="20" />
            </div>
        </div>
    );
};

export default Navbar;
