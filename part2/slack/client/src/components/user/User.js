import { css } from "@emotion/react";
import { userCss } from "./User.style";

const User = ({ id, status, onClick, socketId }) => {
    return (
        <li css={userCss} data-id={id} data-socketId={socketId} data-status={status} onClick={onClick}>
            <span className={status ? "active" : "deactive"} />
            <span className="user" data-id={id} data-socketId={socketId} data-status={status}>{id}</span>
        </li>
    );
};

export default User;
