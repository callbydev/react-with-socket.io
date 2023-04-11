import { useEffect, useState } from "react";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import styles from "./App.module.css";
import { socket } from "./socket";
import logo from "./images/logo.png";

const PostingContainer = () => {
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
    <div className={styles.wrap}>
      <h2>{isLogin && `Login as a ${user}`}</h2>
      {isLogin ? (
        <div className={styles.container}>
          <Navbar />
          {post.map((p) => (
            <Card key={p.id} post={p} loginUser={user} />
          ))}
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.login}>
            <img src={logo} width="200px" alt="logo" className={styles.img} />
            <form className={styles.loginForm} onSubmit={onLoginHandler}>
              <input
                className={styles.input}
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

export default PostingContainer;
