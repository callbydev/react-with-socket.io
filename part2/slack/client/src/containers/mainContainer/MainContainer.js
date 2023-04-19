import React, { useEffect, useState, useContext } from "react";
import { css } from "@emotion/react";
import {
    mainContainerCss,
    slackMainCss,
    slackHeaderCss,
    slackWindowCss,
    mainContentCss,
} from "./MainContainer.style";
import { socket } from "../../socket";
import { SideBar, ChatRoom } from "../../components";
import { USER_LIST } from "../../context/action";
import { Context } from "../../context";

const MainContainer = () => {
    const {
        state: { userId },
        dispatch,
    } = useContext(Context);
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        function setUserListHandler(data) {
            console.log(data);
            dispatch({
                type: USER_LIST,
                payload: data,
            });
        }
        socket.on("user-list", setUserListHandler);
        return () => {
            socket.off("user-list", setUserListHandler);
        };
    }, []);
    return (
        <div css={mainContainerCss}>
            <div css={slackMainCss}>
                <header css={slackHeaderCss}>
                    <ul css={slackWindowCss}>
                        <li className="red"></li>
                        <li className="orange"></li>
                        <li className="green"></li>
                    </ul>
                    <div className="user">{userId}</div>
                </header>
                <article css={mainContentCss}>
                    <SideBar />
                    <ChatRoom />
                </article>
            </div>
        </div>
    );
};

export default MainContainer;
