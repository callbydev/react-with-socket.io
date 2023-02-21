import { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { io } from "socket.io-client";


const App = () => {
  const socketIo = useRef(null);
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [post, setPost] = useState([]);

  useEffect(() => {
    socketIo.current = io("http://localhost:5000");
  }, []);

  useEffect(() => {
    if (!socketIo.current) return;
    if (!isLogin) return;
    socketIo.current.on("user-list", (data) => {
      setPost(JSON.parse(data));
    });
  }, [isLogin]);

  const setUserNameHandler = (e) => {
    setUser(e.target.value);
  };
  const loginHandler = () => {
    setIsLogin(true);
    socketIo.current.emit("newUser", user);
  };

  return (
    <div className="wrap">
      <h2>{isLogin && `Login as a ${user}`}</h2>
      {isLogin ? (
        <div className="container">
          <Navbar socket={socketIo} />
          {post.map((p) => (
            <Card key={p.id} post={p} socket={socketIo} loginUser={user} />
          ))}
        </div>
      ) : (
        <div className="container">
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
        </div>
      )}
    </div>
  );
};

export default App;
