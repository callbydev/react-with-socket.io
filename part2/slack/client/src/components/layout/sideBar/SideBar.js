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

const SideBar = () => {
    const {
        state: { userList, currentChat },
        dispatch,
    } = useContext(Context);
    const onUserClickHandler = (e) => {
        const { id, socketid } = e.target.dataset;
        dispatch({
            type: CURRENT_CHAT,
            payload: { targetId: [id], roomNumber: socketid },
        });
    };
    return (
        <nav css={navBarWrapCss}>
            <div css={titleCss}> Slack</div>
            <ul css={userListCss}>
                <li css={directMsgCss}>
                    <BiChevronDown size="20" /> Direct Messages +
                </li>
                {userList.map((v) => (
                    <User
                        id={v.userId}
                        status={v.status}
                        socketId={v.socketId}
                        onClick={onUserClickHandler}
                    />
                ))}
            </ul>
        </nav>
    );
};

export default SideBar;
