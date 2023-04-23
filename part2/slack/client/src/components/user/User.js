import { css } from "@emotion/react";
import { userCss } from "./User.style";

const User = ({ id, status, onClick, socket }) => {
  return (
    <div
      css={userCss}
      data-id={id}
      data-socket={socket}
      data-status={status}
      onClick={onClick}
    >
      <span className={status ? "active" : "deactive"} />
      <span
        className="user"
        data-id={id}
        data-socket={socket}
        data-status={status}
      >
        {id}
      </span>
    </div>
  );
};

export default User;
