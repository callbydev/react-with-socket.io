import React, { useEffect } from "react";
import QuillCursors from "quill-cursors";
import "./textEditor.css";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  cursors: true,
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ],
};

Quill.register("modules/cursors", QuillCursors);

const TextEditor = ({ text, onChangeTextHandler, reactQuillRef, onChangeSelection }) => {
  return (
    <div className="container">
      <ReactQuill
        theme="snow"
        modules={modules}
        value={text}
        onChange={onChangeTextHandler}
        onChangeSelection={onChangeSelection}
        ref={(el) => {
          reactQuillRef.current = el;
        }}
      />
    </div>
  );
};

export default TextEditor;
