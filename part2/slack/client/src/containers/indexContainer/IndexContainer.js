/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  indexContainerCss,
  loginWrapCss,
  headerCss,
} from "./IndexContainer.styled";
import logo from "../../images/logo.png";

const IndexContainer = () => {
  return (
    <div css={indexContainerCss}>
      <div css={loginWrapCss}>
        <h1 css={headerCss}>
          <img src={logo} width="100px" height="auto" alt="logo" />
        </h1>
      </div>
    </div>
  );
};

export default IndexContainer;
