import React, { useState, useContext, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import {
    chatRoomWrapCss,
    subTitleCss,
    chatBoxCss,
    textBoxCss,
} from "./ChatRoom.style";
import { TextEditor } from "../../index";

const ChatRoom = () => {
    const {
        state: { currentChat },
    } = useContext(Context);
    const reactQuillRef = useRef(null);
    const [text, setText] = useState("");
    const onChange = () => {};
    return (
        <article css={chatRoomWrapCss}>
            <div css={subTitleCss}>
                {/* <span className={status ? "active" : "deactive"} /> */}
                {currentChat.targetId.map((v) => (
                    <span className="user">{v}</span>
                ))}
            </div>
            <ul css={chatBoxCss}></ul>
            <TextEditor
                text={text}
                reactQuillRef={reactQuillRef}
                onChangeTextHandler={setText}
            />
        </article>
    );
};

export default ChatRoom;
