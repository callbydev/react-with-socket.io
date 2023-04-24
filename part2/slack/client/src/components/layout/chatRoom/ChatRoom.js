import React, { useState, useContext, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import {
  chatRoomWrapCss,
  subTitleCss,
  chatBoxCss,
  textBoxCss,
  chatCss,
} from "./ChatRoom.style";
import { TextEditor } from "../../index";
import { socket } from "../../../socket";

const ChatRoom = () => {
  const {
    state: { currentChat, loginInfo },
  } = useContext(Context);
  const reactQuillRef = useRef(null);
  const [text, setText] = useState("");
  const [msgList, setMsgList] = useState([]);
  useEffect(() => {
    function setPrivateMsgListHandler(data) {
      const { msg, fromUserId, toUserId } = data;
      if (
        currentChat.roomNumber === `${fromUserId}-${toUserId}` ||
        currentChat.roomNumber === `${toUserId}-${fromUserId}`
      ) {
        setMsgList((prev) => [
          ...prev,
          {
            msg: msg,
            userId: fromUserId,
          },
        ]);
      }
    }
    socket.on("private-msg", setPrivateMsgListHandler);
    return () => {
      socket.off("private-msg", setPrivateMsgListHandler);
    };
  }, [currentChat.roomNumber]);
  useEffect(() => {
    function setMsgListInit(data) {
      setMsgList(
        data.msg.map((m) => ({
          msg: m.msg,
          userId: m.fromUserId,
        }))
      );
    }
    socket.on("msg-init", setMsgListInit);
    return () => {
      socket.off("msg-init", setMsgListInit);
    };
  }, []);
  useEffect(() => {
    return () => {
      setMsgList([]);
    };
  }, [currentChat.roomNumber]);
  const onPrivateMsgSendHandler = () => {
    const msg = reactQuillRef.current.unprivilegedEditor.getText();
    setMsgList((prev) => [
      ...prev,
      {
        msg: msg,
        userId: loginInfo.userId,
      },
    ]);
    socket.emit("privateMsg", {
      msg: msg,
      toUserId: currentChat.targetId[0],
      toUserSocketId: currentChat.targetSocketId,
      fromUserId: loginInfo.userId,
    });
    setText("");
  };
  return (
    <article css={chatRoomWrapCss}>
      <div css={subTitleCss}>
        {/* <span className={status ? "active" : "deactive"} /> */}
        {currentChat.targetId.map((v) => (
          <span className="user">{v}</span>
        ))}
      </div>
      <ul css={chatBoxCss}>
        {msgList.map((v, i) => (
          <li css={chatCss} key={`${i}-chat`}>
            <div className="userBox">
              <span className="user">{v.userId}</span>
              <span className="date">12:21PM</span>
            </div>
            <div className="textBox">{v.msg}</div>
          </li>
        ))}
      </ul>
      {currentChat.roomNumber && (
        <TextEditor
          onSendHandler={onPrivateMsgSendHandler}
          text={text}
          reactQuillRef={reactQuillRef}
          onChangeTextHandler={setText}
        />
      )}
    </article>
  );
};

export default ChatRoom;
