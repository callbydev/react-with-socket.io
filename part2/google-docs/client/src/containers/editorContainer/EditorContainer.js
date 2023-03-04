import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import TextEditor from "../../components/textEditor/TextEditor";

const EditorContainer = () => {
  const socketIo = useRef(null);
  const timerRef = useRef(null);
  const { id: documentId } = useParams();

  const [text, setText] = useState("");

  useEffect(() => {
    socketIo.current = io("http://localhost:5000");
    return () => {
      socketIo.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketIo.current) return;
    socketIo.current.emit("join", documentId);
  }, []);

  useEffect(() => {
    if (!socketIo.current) return;
    socketIo.current.once("initDocument", (document) => {
      console.log("init");
      setText(document);
    });
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!socketIo.current) return;
  //     socketIo.current.emit("save-document", text);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [text]);

  const onChangeTextHandler = (e) => {
    console.log(e);
    setText(e);
    if (!socketIo.current) return;
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log("aaa");
      socketIo.current.emit("save-document", e);
      timerRef.current = null;
    }, 1000);
    // socketIo.current.emit("send-changes", e);
  };

  useEffect(() => {
    if (!socketIo.current) return;

    socketIo.current.on("receive-changes", (text) => {
      console.log("rece", text);
      setText(text);
    });
    return () => {
      socketIo.current.off("receive-changes");
    };
  }, []);

  return <TextEditor text={text} onChangeTextHandler={onChangeTextHandler} />;
};

export default EditorContainer;
