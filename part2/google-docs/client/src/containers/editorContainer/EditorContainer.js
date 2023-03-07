import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { debounce } from "lodash-es";
import TextEditor from "../../components/textEditor/TextEditor";

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
    socketIo.current.once("initDocument", (document) => {
      setText(document);
    });
  }, []);

  const onChangeTextHandler = (content, delta, source, editor) => {
    if (!socketIo.current) return;
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log("aaa");
      socketIo.current.emit(
        "save-document",
        reactQuillRef.current.getEditor().getContents()
      );
      timerRef.current = null;
    }, 1000);
    if (source !== "user") return;
    socketIo.current.emit("send-changes", delta);
  };

  useEffect(() => {
    if (!reactQuillRef.current) return;
    cursorRef.current = reactQuillRef.current.getEditor().getModule("cursors");
    cursorRef.current.createCursor("cursor", "User 1", "red");
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
      debouncedUpdate(range);
    });
    return () => {
      socketIo.current.off("receive-cursor");
    };
  }, []);

  const debouncedUpdate = debounce((range) => {
    cursorRef.current.moveCursor("cursor", range);
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
