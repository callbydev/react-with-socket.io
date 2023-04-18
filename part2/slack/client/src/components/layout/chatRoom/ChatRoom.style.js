import { css } from "@emotion/react";

export const chatRoomWrapCss = css`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;
export const subTitleCss = css`
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    font-size: 20px;
    height: 50px;
    font-weight: bold;
    padding: 0 20px;
    border-bottom: 1px solid #cecece;

    .active {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #29ac76;
    }
    .deactive {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        border: 1px solid #cecece;
    }
`;
export const chatBoxCss = css`
    list-style: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    flex: 1 1 auto;
    overflow: scroll;
`;
export const textBoxCss = css`
`;
