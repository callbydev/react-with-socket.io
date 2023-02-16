import "./card.css";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { BiMessageRounded } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";

const Card = ({ post, socket, user }) => {
    const [liked, setLiked] = useState(false);

    const handleNotification = (type) => {
        if (!socket.current) return;
        type === 1 && setLiked(true);
        socket.current.emit("sendNotification", {
            senderName: user,
            receiverName: post.username,
            type,
        });
    };

    return (
        <div className="card">
            <div className="info">
                <img src={post.userImg} alt="" className="userImg" />
                <span>{post.fullname}</span>
                <FiMoreVertical size="20" />
            </div>
            <img src={post.postImg} alt="" className="postImg" />
            <div className="interaction">
                {liked ? (
                    <AiOutlineHeart size="20" />
                ) : (
                    <AiOutlineHeart size="20" />
                )}
                <BiMessageRounded size="20" />
                <HiOutlinePaperAirplane size="20" />
            </div>
        </div>
    );
};

export default Card;
