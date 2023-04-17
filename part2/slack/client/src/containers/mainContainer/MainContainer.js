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
import { SideBar } from "../../components";
import { Context } from "../../context";

const MainContainer = () => {
    const {
        state: { userId },
    } = useContext(Context);
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        function setUserListHandler(data) {
            setUserList(data);
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
                    <SideBar userList={userList} />
                </article>
            </div>
        </div>
    );
};

export default MainContainer;
