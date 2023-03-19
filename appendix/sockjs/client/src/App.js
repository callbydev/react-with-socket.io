import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import SockJs from "sockjs-client";
import sockLogo from "./images/sockjs.png";

function App() {
  const sockJs = useRef(null);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  useEffect(() => {
    sockJs.current = new SockJs("http://0.0.0.0:9999/sock");
  }, []);
  useEffect(() => {
    if (!sockJs.current) return;
    sockJs.current.onopen = function () {
      console.log("open", sockJs.current.protocol);
    };
    sockJs.current.onmessage = function (e) {
      const { data, id } = JSON.parse(e.data);
      setMsgList((prev) => [...prev, { msg: data, type: "other", id: id }]);
    };
    sockJs.current.onclose = function () {
      console.log("close");
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };
    sockJs.current.send(JSON.stringify(sendData));
    setIsLogin(true);
  };
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };
    sockJs.current.send(JSON.stringify(sendData));
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };
  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) => (
                <li className={v.type} key={`${i}_li`}>
                  <div className="userId">{v.id}</div>
                  <div className={v.type}>{v.msg}</div>
                </li>
              ))}
              <li ref={messagesEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
          <div className="login-box">
            <h1 className="login-title">
              SockChat{" "}
              <img src={sockLogo} width="30px" height="auto" alt="logo" />
            </h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <div className="btn-box">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
