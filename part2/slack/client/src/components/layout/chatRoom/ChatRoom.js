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
        function setMsgListHandler(data) {
            console.log(data);
        }
        socket.on("get-msg", setMsgListHandler);
        return () => {
            socket.off("get-msg", setMsgListHandler);
        };
    }, []);
    useEffect(() => {
        console.log(currentChat.roomNumber);
        return () => {
            setMsgList([]);
        };
    }, [currentChat.roomNumber]);
    const onMsgSendHandler = () => {
        const msg = reactQuillRef.current.unprivilegedEditor.getText();
        setMsgList((prev) => [
            ...prev,
            {
                msg: msg,
                userId: loginInfo.userId,
                socketId: loginInfo.socketId,
            },
        ]);
        socket.emit("sendMsg", {
            msg: msg,
            roomNumber: currentChat.roomNumber,
            sender: loginInfo.socketId,
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
                {msgList.map((v) => (
                    <li css={chatCss}>
                        <div className="userBox">
                            <span className="user">{v.userId}</span>
                            <span className="date">12:21PM</span>
                        </div>
                        <div className="textBox">{v.msg}</div>
                    </li>
                ))}
            </ul>
            <TextEditor
                onSendHandler={onMsgSendHandler}
                text={text}
                reactQuillRef={reactQuillRef}
                onChangeTextHandler={setText}
            />
        </article>
    );
};

export default ChatRoom;
