import React, { useState, useContext, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import {
  chatRoomWrapCss,
  subTitleCss,
  chatBoxCss,
  textBoxCss,
  chatBoxGuidCss,
  chatCss,
} from "./ChatRoom.style";
import { TextEditor, GroupTextInput } from "../../index";
import { socket } from "../../../socket";
import { USER_LIST } from "../../../context/action";
import logo from "../../../images/logo.png";

const ChatRoom = () => {
  const {
    dispatch,
    state: { currentChat, loginInfo, groupChat, userList },
  } = useContext(Context);
  const reactQuillRef = useRef(null);
  const [text, setText] = useState("");
  const [groupUser, setGroupUser] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [groupChatUsers, setGroupChatUsers] = useState([]);
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
  const onGroupSendHandler = (e) => {
    e.preventDefault();
    // if (!userList.includes(groupUser)) return;
    setGroupChatUsers([...groupChatUsers, groupUser]);
    setGroupUser("");
  };
  const onChangeGroupTextHandler = (e) => {
    setGroupUser(e.target.value);
  };
  const groupChatUserCloseClick = (e) => {
    const { id } = e.target.dataset;
    setGroupChatUsers(groupChatUsers.filter((v) => v !== id));
  };
  const onJoinClick = () => {
    if (groupChatUsers.length <= 0) return;
    const user = {
      socketId: groupChatUsers.join(","),
      status: true,
      userId: groupChatUsers.join(","),
      type: "group",
    };
    dispatch({
      type: USER_LIST,
      payload: [...userList, user],
    });
    socket.emit("userListUpdate", user);
    setGroupChatUsers([]);
  };
  return (
    <article css={chatRoomWrapCss}>
      <div css={subTitleCss}>
        {groupChat.textBarStatus ? (
          <GroupTextInput
            groupText={groupUser}
            onChangeGroupTextHandler={onChangeGroupTextHandler}
            groupChatUserList={groupChatUsers}
            onGroupSendHandler={onGroupSendHandler}
            groupChatUserCloseClick={groupChatUserCloseClick}
            onJoinClick={onJoinClick}
          />
        ) : (
          currentChat.targetId.map((v) => <span className="user">{v}</span>)
        )}
      </div>
      {currentChat.roomNumber ? (
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
      ) : (
        <div css={chatBoxGuidCss}>
          <img src={logo} width="100px" height="auto" alt="logo" />
          <div className="guide">Please, Choose a conversation.</div>
        </div>
      )}
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
