import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { BiMessageRounded } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import { socket } from "../../socket";
import styles from "./Card.module.css";

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
    <div className={styles.card} key={key}>
      <div className={styles.info}>
        <div>
          <img src={post.userImg} alt="" className={styles.userImg} />
          <div className={styles.username}>
            <div>{post.userName}</div>
            <div className={styles.loc}>{post.location}</div>
          </div>
        </div>
        <FiMoreVertical size="20" />
      </div>
      <img src={post.postImg} alt="" className={styles.postImg} />
      <div className={styles.icons}>
        {liked ? (
          <AiFillHeart
            className={styles.fillHeart}
            size="20"
            onClick={onLikeHandler}
            data-type="1"
          />
        ) : (
          <AiOutlineHeart
            className={styles.heart}
            size="20"
            onClick={onLikeHandler}
            data-type="0"
          />
        )}
        <BiMessageRounded className={styles.msg} size="20" />
        <HiOutlinePaperAirplane className={styles.airplane} size="20" />
      </div>
    </div>
  );
};

export default Card;
