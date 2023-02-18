import React, { useState } from "react";
import "./input.css";

const Input = () => {
  const [text, setText] = useState("");
  const onChangeHandler = (e) => {
    setText(e.target.value);
  };
  return (
    <div className="input-box">
      <input
        type="text"
        className="input"
        value={text}
        onChange={onChangeHandler}
      />
      <div>{text}</div>
    </div>
  );
};

export default Input;
