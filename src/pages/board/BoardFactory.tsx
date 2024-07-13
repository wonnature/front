import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { successAlert, warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import DropdownMenu from "./DropdownMenu";

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

const menuItems = [
  { name: "학교기업 '원네이처'", url: "/introduce/intro" },
  { name: "인사말", url: "/introduce/greeting" },
  { name: "설립목적", url: "/introduce/purpose" },
  { name: "연혁", url: "/introduce/history" },
  { name: "사업분야", url: "/introduce/business-field" },
  { name: "화장품 시험·검사 서비스", url: "/quality-test/service" },
  { name: "기계보유현황", url: "/quality-test/result" },
  { name: "품질검사 및 검사항목", url: "/quality-test/category" },
  { name: "품질검사 신청", url: "/quality-test/apply" },
];

interface FileObject {
  file: File | null;
  url: string | null;
}

const BoardFactory: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([]);
  const [isContentTop, setIsContentTop] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState("");

  const quillRef = useRef<ReactQuill>(null);
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // 글 수정 기능
  useEffect(() => {
    checkUser();
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

  const getEditData = async (pathname: string) => {
    try {
      const response = await api.get(`/board?pathname=${pathname}`);

      if (response.data.content) {
        const { imageUrls, content, isContentTop } = response.data.content;
        const transformedContent = convertSpacesToNbsp(content); // 여기서 공백을 변환
        setContent(transformedContent);
        setIsContentTop(isContentTop);
        let initialImageUrls = imageUrls;

        const initialFiles = initialImageUrls.map((url: string) => ({
          file: null,
          url,
        }));
        setSelectedFiles((prevFiles) => [...prevFiles, ...initialFiles]);
        if (imageUrls.length === 0) setSelectedFiles([]);
      } else {
        setContent("내용을 작성해주세요");
        setSelectedFiles([]);
      }
    } catch (error: any) {
      const result = await warningAlert(error.response.data.message);
      navigate("/write"); // 수정이 아닌 그냥 글쓰기로 이동
      console.log(result);
    }
  };

  const convertSpacesToNbsp = (htmlString: string) => {
    return htmlString.replace(/ {2,}/g, (match) => {
      return match
        .split("")
        .map(() => "&nbsp;")
        .join("");
    });
  };

  const convertNbspToSpaces = (text: string) => {
    return text.replace(/'\u00A0'/g, " ");
  };

  useEffect(() => {
    if (selectedValue) getEditData(selectedValue);
  }, [selectedValue]);

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

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedUrl = event.target.value;
    setSelectedValue(selectedUrl);
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
    let imageUrls: string[] = []; // 서버에 업로드할 imageUrl 배열
    let index = 0;

    for (const { file, url } of selectedFiles) {
      if (file) {
        // 파일을 로컬에서 추가한 경우
        formData.append("file", file);
        imageUrls.push(index++ as any); // 우선 이미지 url 대신 index 값을 삽입 후 추후 대체함
      } else {
        imageUrls.push(url!); // 수정 시 이미 업로드 된 이미지
      }
    }
    try {
      const formDataEntries = [...formData.entries()]; // 로컬에서 추가한 이미지 갯수 확인을 위한 변수
      if (formDataEntries.length >= 1) {
        const fileUploadResponse = await api.post(
          `/board/image`, // 서버 측 업로드 엔드포인트에 전송
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploadedUrls = fileUploadResponse.data.content; // 서버로부터 받은 이미지 URL 리스트
        let uploadIndex = 0;

        // imageUrls 배열 중 index값을 서버에서 받은 image Url로 대체
        for (let i = 0; i < imageUrls.length; i++) {
          if (typeof imageUrls[i] === "number") {
            imageUrls[i] = uploadedUrls[uploadIndex++];
          }
        }
        // AWS에 이미지 업로드 완료 후 링크 반환된걸 imageUrls에 저장 성공 ---
      }

      const boardData = {
        content: convertNbspToSpaces(content),
        isContentTop,
        pathName: selectedValue,
        imageUrls: imageUrls, // 게시글에 있는 이미지 urls들 최종 값 업로드
      };

      const response = await api.patch(
        `/board?pathname=${selectedValue}`,
        boardData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsUploading(false); // 업로드 상태를 마침
      successAlert(response.data.message);
      navigate(`${selectedValue}`);
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

  const getFileName = (url: string) => {
    const parts = url.split("/");
    const encodedFileName = parts[parts.length - 1];
    return decodeURIComponent(encodedFileName);
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
      clipboard: {
        matchVisual: false,
      },
    };
  }, []);

  return (
    <Container>
      <Label>수정할 게시판</Label>
      <DropdownMenu
        items={menuItems}
        onSelectionChange={handleSelectionChange}
      />
      <Label>본문이 사진 상단에 위치</Label>
      <RadioButtonContainer>
        <RadioButton
          type="radio"
          name="isContentTop"
          checked={isContentTop}
          onChange={() => setIsContentTop(true)}
        />
        <span onClick={() => setIsContentTop(true)}>예</span>
        <RadioButton
          type="radio"
          name="isContentTop"
          checked={!isContentTop}
          onChange={() => setIsContentTop(false)}
        />
        <span onClick={() => setIsContentTop(false)}>아니오</span>
      </RadioButtonContainer>
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
      <FileInputLabel htmlFor="file-upload">이미지 추가</FileInputLabel>
      <FileInput
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <ImagePreview>
        {selectedFiles?.map(({ file, url }, index) => (
          <ImageContainer key={index}>
            <Image
              src={file ? URL.createObjectURL(file) : url!}
              alt={`preview ${index}`}
            />
            <ImgNumber>{index + 1}</ImgNumber>
            <PhotoName>{file ? file.name : getFileName(url!)}</PhotoName>
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
          </ImageContainer>
        ))}
      </ImagePreview>
      <ConfirmBtn onClick={handleSubmit} disabled={isUploading}>
        {isUploading ? "업로드 중..." : "게시판 수정"}
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

const RadioButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const RadioButton = styled.input`
  margin: 0 5px;
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

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageContainer = styled.div`
  width: calc(50% - 5px);
  position: relative;

  @media screen and (max-width: 550px) {
    width: calc(100%);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 330px;
  object-fit: cover;
  border: 1px solid #ddd;
`;

const ImgNumber = styled.div`
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
  bottom: 6px;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin: 10px;
`;

const PhotoName = styled.div`
  max-width: 50%;
  padding: 5px;
  position: absolute;
  bottom: 13px;
  left: 6px;
  word-break: break-all;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ArrowButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 15px;
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

export default BoardFactory;
