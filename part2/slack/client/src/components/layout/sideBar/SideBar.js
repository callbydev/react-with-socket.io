import React, { useState, useContext, useEffect } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import { CURRENT_CHAT, GROUP_CHAT } from "../../../context/action";
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
        state: { userList, loginInfo, currentChat, groupList },
        dispatch,
    } = useContext(Context);
    useEffect(() => {
        console.log(currentChat.targetId[0]);
        socket.emit("msgInit", {
            targetId: currentChat.targetId,
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
    useEffect(() => {
        function setGroupChat(data) {
            socket.emit("resGroupJoinRoom", data.roomNumber);
        }
        socket.on("group-chat-req", setGroupChat);
        return () => {
            socket.off("group-chat-req", setGroupChat);
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
        dispatch({
            type: GROUP_CHAT,
            payload: {
                textBarStatus: false,
                groupChatNames: [],
            },
        });
    };
    const onMakeGroupChat = () => {
        dispatch({
            type: GROUP_CHAT,
            payload: {
                textBarStatus: true,
                groupChatNames: [],
            },
        });
    };
    const onGroupUserClickHandler = (e) => {
        const { id } = e.target.dataset;
        dispatch({
            type: CURRENT_CHAT,
            payload: {
                targetId: [...id.split(",")],
                roomNumber: id,
                targetSocketId: e.target.dataset.socket,
            },
        });
        // socket.emit("reqGroupJoinRoom", {
        //   targetId: id,
        //   targetSocketId: e.target.dataset.socket,
        // });
        dispatch({
            type: GROUP_CHAT,
            payload: {
                textBarStatus: false,
                groupChatNames: [],
            },
        });
    };
    return (
        <nav css={navBarWrapCss}>
            <div css={titleCss}> Slack</div>
            <ul css={userListCss}>
                <li css={directMsgCss} onClick={onMakeGroupChat}>
                    <BiChevronDown size="20" /> Direct Messages +
                </li>
                {userList.map((v, i) => (
                    <li key={`${i}-user`}>
                        <User
                            id={v.userId}
                            status={v.status}
                            socket={v.socketId}
                            type={v.type}
                            onClick={
                                v.type === "group"
                                    ? onGroupUserClickHandler
                                    : onUserClickHandler
                            }
                        />
                    </li>
                ))}
                {groupList.map((v, i) => (
                    <li key={`${i}-user`}>
                        <User
                            id={v.userId}
                            status={v.status}
                            socket={v.socketId}
                            type={v.type}
                            onClick={
                                v.type === "group"
                                    ? onGroupUserClickHandler
                                    : onUserClickHandler
                            }
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideBar;
