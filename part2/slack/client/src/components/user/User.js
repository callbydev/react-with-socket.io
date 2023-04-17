import { css } from "@emotion/react";
import { userCss } from "./User.style";

const User = ({ id, status, onClick }) => {
    return (
        <li css={userCss} data-id={id} data-status={status} onClick={onClick}>
            <span className={status ? "active" : "deactive"} />
            <span className="user">{id}</span>
        </li>
    );
};

export default User;
