import { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { posts } from "./data";
import { io } from "socket.io-client";

const App = () => {
    const socketIo = useRef(null);
    const [user, setUser] = useState("");

    useEffect(() => {
        socketIo.current = io("http://localhost:5000");
    }, []);

    const setUserNameHandler = (e) => {
        setUser(e.target.value);
    };
    const loginHandler = () => {
        socketIo.emit("newUser", user);
    };

    return (
        <div className="container">
            {user ? (
                <>
                    <Navbar socket={socketIo} />
                    {posts.map((post) => (
                        <Card
                            key={post.id}
                            post={post}
                            socket={socketIo}
                            user={user}
                        />
                    ))}
                    <span className="username">{user}</span>
                </>
            ) : (
                <div className="login">
                    <h2>Instagram notification clone</h2>
                    <input
                        type="text"
                        value={user}
                        placeholder="Enter your name"
                        onChange={setUserNameHandler}
                    />
                    <button onClick={loginHandler}>Login</button>
                </div>
            )}
        </div>
    );
};

export default App;
