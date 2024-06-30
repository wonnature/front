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

interface FileObject {
  file: File | null;
  url: string | null;
}

const NoticeFactory: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([]);
  const [isTitleFocused, setIsTitleFocused] = useState<boolean>(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // 글 수정 기능
  useEffect(() => {
    const getEditData = async (id: string) => {
      try {
        const response = await api.get(`/notice/${id}`);

        if (response.data && response.data.content) {
          const { title, fileUrls, content } = response.data.content;
          setTitle(title);
          setContent(content);
          let initialImageUrls = fileUrls;

          const initialFiles = initialImageUrls.map((url: string) => ({
            file: null,
            url,
          }));
          setSelectedFiles((prevFiles) => [...prevFiles, ...initialFiles]);
        }
      } catch (error: any) {
        const result = await warningAlert(error.response.data.message);
        navigate("/write"); // 수정이 아닌 그냥 글쓰기로 이동
        console.log(result);
      }
    };
    if (params.get("edit")) {
      getEditData(params.get("edit") as string);
    }

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
      }
    } catch (error) {
      console.error("Error:", error);
      warningAlert("관리자 로그인을 해주세요.");
      navigate("/login");
    }
  };

  // 뒤로가기 방지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" && !isTitleFocused && !isEditorFocused) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTitleFocused, isEditorFocused]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    const files = Array.from(e.target.files!).map((file) => ({
      file,
      url: null,
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDelete = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newFiles = [...selectedFiles];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [
      newFiles[targetIndex],
      newFiles[index],
    ];
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (isUploading) return;
    // 업로드 중이면 리턴
    setIsUploading(true);

    const formData = new FormData();
    let fileUrls: string[] = []; // 서버에 업로드할 imageUrl 배열
    let index = 0;

    for (const { file, url } of selectedFiles) {
      if (file) {
        // 파일을 로컬에서 추가한 경우
        formData.append("file", file);
        fileUrls.push(index++ as any); // 우선 이미지 url 대신 index 값을 삽입 후 추후 대체함
      } else {
        fileUrls.push(url!); // 수정 시 이미 업로드 된 이미지
      }
    }
    try {
      const formDataEntries = [...formData.entries()]; // 로컬에서 추가한 이미지 갯수 확인을 위한 변수
      if (formDataEntries.length >= 1) {
        const fileUploadResponse = await api.post(
          `/notice/file`, // 서버 측 업로드 엔드포인트에 전송
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploadedUrls = fileUploadResponse.data.content; // 서버로부터 받은 이미지 URL 리스트
        let uploadIndex = 0;

        // fileUrls 배열 중 index값을 서버에서 받은 image Url로 대체
        for (let i = 0; i < fileUrls.length; i++) {
          if (typeof fileUrls[i] === "number") {
            fileUrls[i] = uploadedUrls[uploadIndex++];
          }
        }
        // AWS에 이미지 업로드 완료 후 링크 반환된걸 fileUrls에 저장 성공 ---
      }

      const noticeData = {
        title: title,
        content,
        fileUrls: fileUrls, // 게시글에 있는 이미지 urls들 최종 값 업로드
      };
      let response;
      if (!params.get("edit")) {
        // 글 쓰기
        response = await api.post(`/notice`, noticeData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // 글 수정
        response = await api.patch(
          `/notice/${params.get("edit")}`,
          noticeData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      setIsUploading(false); // 업로드 상태를 마침
      successAlert(response.data.message);
      navigate(`/community/notice/${response.data.content}`);
      console.log(response.data);
    } catch (error: any) {
      setIsUploading(false); // 업로드 상태를 마침
      await warningAlert(error.response.data.message);
    }
  };

  const handleContentChange = (value: string) => {
    try {
      setContent(value);
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
      <Label>제목</Label>
      <Input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>세부 내용</Label>
      <ReactQuill //스타일은 index.css에서 수정
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        modules={modules}
        formats={formats}
      />
      <FileInputLabel htmlFor="file-upload">파일 추가</FileInputLabel>
      <FileInput
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <FilePreview>
        {selectedFiles.map(({ file, url }: any, index) => (
          <FileContainer key={index}>
            <FileName>
              {file ? file.name : decodeURIComponent(url?.split("/").pop())}
            </FileName>
            <FileNumber>{index + 1}</FileNumber>
            <ButtonContainer>
              <ArrowButton
                onClick={() => moveImage(index, "up")}
                disabled={index === 0}
              >
                ◀
              </ArrowButton>
              <ArrowButton
                onClick={() => moveImage(index, "down")}
                disabled={index === selectedFiles.length - 1}
              >
                ▶
              </ArrowButton>
            </ButtonContainer>
            <DeleteButton onClick={() => handleDelete(index)}>
              삭제
            </DeleteButton>
          </FileContainer>
        ))}
      </FilePreview>
      <ConfirmBtn onClick={handleSubmit} disabled={isUploading}>
        {isUploading
          ? "업로드 중..."
          : params.get("edit")
          ? "공지 수정"
          : "공지 등록"}
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

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #14ce5e;
  color: white;
  border-radius: 4px;
  font-size: 1.2rem;
  transition: all 0.3s;

  &:hover {
    background-color: #18c75e !important;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FilePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FileContainer = styled.div`
  width: calc(50% - 5px);
  height: auto;
  position: relative;

  @media screen and (max-width: 550px) {
    width: calc(100%);
  }
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  padding: 10px 60px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  word-break: break-all; //긴 단어를 줄바꿈 */
`;

const FileNumber = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
  color: white;
  font-size: 1.1rem;
  padding: 5px 8px;
  background-color: rgb(0, 0, 0, 0.6);
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin: 10px;
`;

const ArrowButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px;
  &:disabled {
    background: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
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

export default NoticeFactory;
