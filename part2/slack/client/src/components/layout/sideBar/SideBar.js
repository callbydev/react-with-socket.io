import React, { useState, useContext, useEffect } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import { CURRENT_CHAT } from "../../../context/action";
import {
  navBarWrapCss,
  titleCss,
  userListCss,
  directMsgCss,
} from "./SideBar.style";
import { User } from "../../index";
import { BiChevronDown } from "react-icons/bi";
import { socket } from "../../../socket";

const SideBar = () => {
  const {
    state: { userList, loginInfo, currentChat },
    dispatch,
  } = useContext(Context);
  useEffect(() => {
    socket.emit("msgInit", {
      userId: currentChat.targetId[0],
    });
  }, [currentChat.targetId]);
  useEffect(() => {
    function setMsgAlert(data) {
      socket.emit("resJoinRoom", data.roomNumber);
    }
    socket.on("msg-alert", setMsgAlert);
    return () => {
      socket.off("msg-alert", setMsgAlert);
    };
  }, []);
  const onUserClickHandler = (e) => {
    const { id } = e.target.dataset;
    dispatch({
      type: CURRENT_CHAT,
      payload: {
        targetId: [id],
        roomNumber: `${loginInfo.userId}-${id}`,
        targetSocketId: e.target.dataset.socket,
      },
    });
    socket.emit("reqJoinRoom", {
      targetId: id,
      targetSocketId: e.target.dataset.socket,
    });
  };
  return (
    <nav css={navBarWrapCss}>
      <div css={titleCss}> Slack</div>
      <ul css={userListCss}>
        <li css={directMsgCss}>
          <BiChevronDown size="20" /> Direct Messages +
        </li>
        {userList.map((v, i) => (
          <li key={`${i}-user`}>
            <User
              id={v.userId}
              status={v.status}
              socket={v.socketId}
              onClick={onUserClickHandler}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideBar;
