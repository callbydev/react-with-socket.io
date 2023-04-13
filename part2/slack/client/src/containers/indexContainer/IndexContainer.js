import React, { useState, useContext, useEffect } from "react";
import { css } from "@emotion/react";
import {
  indexContainerCss,
  loginWrapCss,
  headerCss,
  loginFormCss,
  inputCss,
  btnCss,
} from "./IndexContainer.styled";
import { socket } from "../../socket";
import { Context } from "../../context";
import { AUTH_INFO } from "../../context/action";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

const IndexContainer = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);
  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log("err");
      }
    });
  }, []);
  const onLoginHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: AUTH_INFO,
      payload: user,
    });
    socket.auth = { userId: user };
    socket.connect();
    navigate("/main");
  };
  const onUserNameHandler = (e) => {
    setUser(e.target.value);
  };
  return (
    <div css={indexContainerCss}>
      <div css={loginWrapCss}>
        <h1 css={headerCss}>
          <img src={logo} width="100px" height="auto" alt="logo" />
        </h1>
        <form css={loginFormCss} onSubmit={onLoginHandler}>
          <input
            css={inputCss}
            type="text"
            value={user}
            placeholder="Enter your ID"
            onChange={onUserNameHandler}
          />
          <button onClick={onLoginHandler} css={btnCss}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndexContainer;
