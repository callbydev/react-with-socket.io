import "./card.css";
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { BiMessageRounded } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import { socket } from "../../socket";

const Card = ({ key, post, loginUser }) => {
    const [liked, setLiked] = useState(false);

    const onLikeHandler = (e) => {
        if (!socket) return;
        const { type } = e.target.closest("svg").dataset;
        setLiked(type === "0");
        socket.emit("sendNotification", {
            senderName: loginUser,
            receiverName: post.username,
            type,
        });
    };

    return (
        <div className="card" key={key}>
            <div className="info">
                <div>
                    <img src={post.userImg} alt="" className="userImg" />
                    <div className="userName">
                        <div>{post.username}</div>
                        <div className="loc">{post.location}</div>
                    </div>
                </div>
                <FiMoreVertical size="20" />
            </div>
            <img src={post.postImg} alt="" className="postImg" />
            <div className="icons">
                {liked ? (
                    <AiFillHeart
                        className="fill-heart"
                        size="20"
                        onClick={onLikeHandler}
                        data-type="1"
                    />
                ) : (
                    <AiOutlineHeart
                        className="heart"
                        size="20"
                        onClick={onLikeHandler}
                        data-type="0"
                    />
                )}
                <BiMessageRounded className="msg" size="20" />
                <HiOutlinePaperAirplane className="airplane" size="20" />
            </div>
        </div>
    );
};

export default Card;
