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
        state: { currentChat },
    } = useContext(Context);
    const reactQuillRef = useRef(null);
    const [text, setText] = useState("");
    const onMsgSendHandler = () => {
        socket.emit("sendMsg", {
            msg: text,
            roomNumber: currentChat.roomNumber,
        });
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
                <li css={chatCss}>
                    <div className="userBox">
                        <span className="user">Kyle</span>
                        <span className="date">12:21PM</span>
                    </div>
                    <div className="textBox">
                        asdsadaasda asdsadaasdass sdsda sssss
                    </div>
                </li>
                <li css={chatCss}>
                    <div className="userBox">
                        <span className="user">Kyle</span>
                        <span className="date">12:21PM</span>
                    </div>
                    <div className="textBox">
                        asdsadaasda asdsadaasdass sdsda sssss
                    </div>
                </li>
                <li css={chatCss}>
                    <div className="userBox">
                        <span className="user">Kyle</span>
                        <span className="date">12:21PM</span>
                    </div>
                    <div className="textBox">
                        asdsadaasda asdsadaasdass sdsda sssss
                    </div>
                </li>
                <li css={chatCss}>
                    <div className="userBox">
                        <span className="user">Kyle</span>
                        <span className="date">12:21PM</span>
                    </div>
                    <div className="textBox">
                        asdsadaasda asdsadaasdass sdsda sssss
                    </div>
                </li>
                <li css={chatCss}>
                    <div className="userBox">
                        <span className="user">Kyle</span>
                        <span className="date">12:21PM</span>
                    </div>
                    <div className="textBox">
                        asdsadaasda asdsadaasdass sdsda sssss
                    </div>
                </li>
                <li css={chatCss}>
                    <div className="userBox">
                        <span className="user">Kyle</span>
                        <span className="date">12:21PM</span>
                    </div>
                    <div className="textBox">
                        asdsadaasda asdsadaasdass sdsda sssss
                    </div>
                </li>
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
