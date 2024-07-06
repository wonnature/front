import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { successAlert, warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Size = Quill.import("formats/size");
Size.whitelist = ["small", "medium", "large", "huge"];
Quill.register(Size, true);

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "size",
  "h1",
];

const HistoryFactory: React.FC = () => {
  const [history, setHistory] = useState<string>("");
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const quillRef = useRef<ReactQuill>(null);
  const navigate = useNavigate();

  // 글 수정 기능
  useEffect(() => {
    checkUser(); //세션만료 체크
  }, []);

  const checkUser = async () => {
    try {
      const response = await api.get(`/user/check`, {
        // skipInterceptor: true,
      });
      if (response?.data?.content?.role !== "ADMIN") {
        warningAlert("관리자 로그인을 해주세요.");
        navigate("/login");
        return;
      }

      getHistory();
    } catch (error) {
      console.error("Error:", error);
      warningAlert("관리자 로그인을 해주세요.");
      navigate("/login");
    }
  };

  const getHistory = async () => {
    try {
      const response = await api.get("/history");
      setHistory(response.data.content.content);
    } catch (error: any) {
      warningAlert(error.response.data.message);
    }
  };

  // 뒤로가기 방지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" && !isEditorFocused) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditorFocused]);

  const handleSubmit = async () => {
    if (isUploading) return;
    // 업로드 중이면 리턴
    if (!history) return warningAlert("내용을 작성해주세요.");
    setIsUploading(true);

    const historyData = {
      content: history,
    };

    try {
      const response = await api.patch(`/history`, historyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsUploading(false); // 업로드 상태를 마침
      successAlert(response.data.message);
      navigate(`/introduce/history`);
    } catch (error: any) {
      setIsUploading(false); // 업로드 상태를 마침
      await warningAlert(error.response.data.message);
    }
  };

  const handleContentChange = (value: string) => {
    try {
      setHistory(value);
    } catch (error) {
      console.error("Error updating editor content:", error);
    }
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

  return (
    <Container>
      <Label>연혁 내용</Label>
      <ReactQuill //스타일은 index.css에서 수정
        ref={quillRef}
        value={history}
        onChange={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        modules={modules}
        formats={formats}
      />

      <ConfirmBtn onClick={handleSubmit} disabled={isUploading}>
        {isUploading ? "업로드 중..." : "연혁 수정"}
      </ConfirmBtn>
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  margin: 0;
`;

const Label = styled.div`
  font-size: 1.3rem;
  margin-top: 10px;
  margin-bottom: -15px;
  font-weight: 600;
`;

const ConfirmBtn = styled.button`
  padding: 10px 0;
  border: 0px;
  background-color: ${(props) => (!props.disabled ? "#007bff" : "gray")};
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s;

  &:hover {
    filter: brightness(80%);
  }
`;

export default HistoryFactory;
