import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import logo from "./images/iologo.png";
import { io } from "socket.io-client";

// 1
const webSocket = io("http://localhost:5000");

function App() {
    // 2
    const messagesEndRef = useRef(null);
    const [userId, setUserId] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [msg, setMsg] = useState("");
    const [msgList, setMsgList] = useState([]);
    const [privateTarget, setPrivateTarget] = useState("");
    // 3
    useEffect(() => {
        if (!webSocket) return;
        webSocket.on("sMessage", (msg) => {
            const { data, id, target } = msg;
            setMsgList((prev) => [
                ...prev,
                {
                    msg: data,
                    type: target ? "private" : "other",
                    id: id,
                },
            ]);
        });
        webSocket.on("sLogin", (msg) => {
            setMsgList((prev) => [
                ...prev,
                {
                    msg: `${msg} joins the chat`,
                    type: "welcome",
                    id: "",
                },
            ]);
        });
    }, []);
    // 5
    useEffect(() => {
        scrollToBottom();
    }, [msgList]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 6
    const onSubmitHandler = (e) => {
        e.preventDefault();
        webSocket.emit("login", userId);
        setIsLogin(true);
    };
    // 7
    const onChangeUserIdHandler = (e) => {
        setUserId(e.target.value);
    };
    // 8
    const onSendSubmitHandler = (e) => {
        e.preventDefault();
        const sendData = {
            data: msg,
            id: userId,
            target: privateTarget,
        };
        webSocket.emit("message", sendData);
        setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
        setMsg("");
    };
    // 9
    const onChangeMsgHandler = (e) => {
        setMsg(e.target.value);
    };
    const onSetPrivateTarget = (e) => {
        const { id } = e.target.dataset;
        setPrivateTarget((prev) => (prev === id ? "" : id));
    };
    return (
        <div className="app-container">
            <div className="wrap">
                {isLogin ? (
                    // 10
                    <div className="chat-box">
                        <h3>Login as a "{userId}"</h3>
                        <ul className="chat">
                            {msgList.map((v, i) =>
                                v.type === "welcome" ? (
                                    <li className="welcome">
                                        <div className="line" />
                                        <div>{v.msg}</div>
                                        <div className="line" />
                                    </li>
                                ) : (
                                    <li
                                        className={v.type}
                                        key={`${i}_li`}
                                        name={v.id}
                                        data-id={v.id}
                                        onClick={onSetPrivateTarget}
                                    >
                                        <div
                                            className={
                                                v.id === privateTarget
                                                    ? "private-user"
                                                    : "userId"
                                            }
                                            data-id={v.id}
                                            name={v.id}
                                        >
                                            {v.id}
                                        </div>
                                        <div
                                            className={v.type}
                                            data-id={v.id}
                                            name={v.id}
                                        >
                                            {v.msg}
                                        </div>
                                    </li>
                                )
                            )}
                            <li ref={messagesEndRef} />
                        </ul>
                        <form
                            className="send-form"
                            onSubmit={onSendSubmitHandler}
                        >
                            {privateTarget && (
                                <div className="private-target">
                                    {privateTarget}
                                </div>
                            )}
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
                        <div className="login-title">
                            <img
                                src={logo}
                                width="40px"
                                height="40px"
                                alt="logo"
                            />
                            <div>IOChat</div>
                        </div>
                        <form className="login-form" onSubmit={onSubmitHandler}>
                            <input
                                placeholder="Enter your ID"
                                onChange={onChangeUserIdHandler}
                                value={userId}
                            />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
