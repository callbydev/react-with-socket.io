import { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { socket } from "./socket";

const App = () => {
    const [user, setUser] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [post, setPost] = useState([]);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                console.log("err");
            }
        });
    }, []);

    useEffect(() => {
        if (!isLogin) return;
        function setPosting(data) {
            setPost(data);
        }
        socket.on("user-list", setPosting);
        return () => {
            socket.off("user-list", setPosting);
        };
    }, [isLogin]);

    const setUserNameHandler = (e) => {
        setUser(e.target.value);
    };
    const onLoginHandler = (e) => {
        e.preventDefault();
        setIsLogin(true);
        socket.auth = { username: user };
        socket.connect();
    };

    return (
        <div className="wrap">
            <h2>{isLogin && `Login as a ${user}`}</h2>
            {isLogin ? (
                <div className="container">
                    <Navbar />
                    {post.map((p) => (
                        <Card key={p.id} post={p} loginUser={user} />
                    ))}
                </div>
            ) : (
                <div className="container">
                    <div className="login">
                        <h2>Instagram notification clone</h2>
                        <form className="login-form" onSubmit={onLoginHandler}>
                            <input
                                type="text"
                                value={user}
                                placeholder="Enter your name"
                                onChange={setUserNameHandler}
                            />
                            <button onClick={onLoginHandler}>Login</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
