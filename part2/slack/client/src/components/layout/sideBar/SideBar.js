import React, { useState, useContext, useEffect } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import { navBarWrapCss, titleCss, userListCss } from "./SideBar.style";
import { User } from "../../index";

const SideBar = ({ userList }) => {
    const {
        state: {},
    } = useContext(Context);
    console.log(userList);
    return (
        <nav css={navBarWrapCss}>
            <div css={titleCss}> Slack</div>
            <ul css={userListCss}>
                {userList.map((v) => (
                    <User id={v.userId} status={v.status} />
                ))}
            </ul>
        </nav>
    );
};

export default SideBar;
