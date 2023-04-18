import { css } from "@emotion/react";
import { containerCss, sendCss } from "./textEditor.style";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { HiPaperAirplane } from "react-icons/hi2";

const modules = {
    toolbar: {
        containers: [
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
        ],
    },
};

const TextEditor = ({ text, onChangeTextHandler, reactQuillRef }) => {
    return (
        <div css={containerCss}>
            <HiPaperAirplane css={sendCss} />
            <ReactQuill
                theme="snow"
                modules={modules}
                value={text}
                onChange={onChangeTextHandler}
                ref={(el) => {
                    reactQuillRef.current = el;
                }}
            ></ReactQuill>
        </div>
    );
};

export default TextEditor;
