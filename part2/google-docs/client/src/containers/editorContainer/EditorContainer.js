import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { debounce } from "lodash-es";
import TextEditor from "../../components/textEditor/TextEditor";

const cursorMap = new Map();
const cursorColor = [
  "#FF0000",
  "#FF5E00",
  "#FFBB00",
  "#FFE400",
  "#ABF200",
  "#1DDB16",
  "#00D8FF",
  "#0054FF",
];

const EditorContainer = () => {
  const socketIo = useRef(null);
  const timerRef = useRef(null);
  const cursorRef = useRef(null);
  const reactQuillRef = useRef(null);
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
    socketIo.current.once("initDocument", (res) => {
      const { _document, userList } = res;
      setText(_document);
      userList.forEach((u) => {
        setCursor(u);
      });
    });
  }, []);

  useEffect(() => {
    if (!socketIo.current) return;

    socketIo.current.on("newUser", (user) => {
      setCursor(user);
    });
    return () => {
      socketIo.current.off("newUser");
    };
  }, []);

  useEffect(() => {
    if (!reactQuillRef.current) return;
    cursorRef.current = reactQuillRef.current.getEditor().getModule("cursors");
  }, []);

  useEffect(() => {
    if (!socketIo.current) return;

    socketIo.current.on("receive-changes", (delta) => {
      console.log("rece", delta);
      reactQuillRef.current.getEditor().updateContents(delta);
    });
    return () => {
      socketIo.current.off("receive-changes");
    };
  }, []);
  useEffect(() => {
    if (!socketIo.current) return;

    socketIo.current.on("receive-cursor", (res) => {
      const { range, id } = res;
      debouncedUpdate(range, id);
    });
    return () => {
      socketIo.current.off("receive-cursor");
    };
  }, []);

  const onChangeTextHandler = (content, delta, source, editor) => {
    if (!socketIo.current) return;
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      socketIo.current.emit(
        "save-document",
        reactQuillRef.current.getEditor().getContents()
      );
      timerRef.current = null;
    }, 1000);
    if (source !== "user") return;
    socketIo.current.emit("send-changes", delta);
  };

  function setCursor(id) {
    if (!cursorMap.get(id)) {
      cursorRef.current.createCursor(
        id,
        id,
        cursorColor[Math.floor(Math.random() * 8)]
      );
      cursorMap.set(id, cursorRef.current);
    }
  }

  const debouncedUpdate = debounce((range, id) => {
    cursorMap.get(id).moveCursor(id, range);
  }, 500);

  const onChangeSelection = (selection, source, editor) => {
    if (source !== "user") return;
    socketIo.current.emit("cursor-changes", selection);
  };

  return (
    <TextEditor
      text={text}
      onChangeTextHandler={onChangeTextHandler}
      onChangeSelection={onChangeSelection}
      reactQuillRef={reactQuillRef}
    />
  );
};

export default EditorContainer;
