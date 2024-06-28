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

const ProductFactory: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [englishTitle, setEnglishTitle] = useState<string>("");
  const [oneLineIntroduce, setOneLineIntroduce] = useState<string>("");
  const [configuration, setConfiguration] = useState<string>("");
  const [storeLink, setStoreLink] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
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
        const response = await api.get(`/product/${id}`);

        if (response.data && response.data.content) {
          const {
            title,
            englishTitle,
            oneLineIntroduce,
            storeLink,
            imageUrls,
            productType,
            content,
            configuration,
          } = response.data.content;
          setTitle(title);
          setContent(content);
          setOneLineIntroduce(oneLineIntroduce);
          setEnglishTitle(englishTitle);
          setStoreLink(storeLink);
          setProductType(productType);
          setConfiguration(configuration);
          let initialImageUrls = imageUrls;

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
          `/product/image`, // 서버 측 업로드 엔드포인트에 전송
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

      const productData = {
        title: title,
        content,
        imageUrls: imageUrls, // 게시글에 있는 이미지 urls들 최종 값 업로드
        storeLink: storeLink,
        productType,
        englishTitle,
        oneLineIntroduce,
        configuration,
      };
      let response;
      if (!params.get("edit")) {
        // 글 쓰기
        response = await api.post(`/product`, productData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // 글 수정
        response = await api.patch(
          `/product/${params.get("edit")}`,
          productData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      setIsUploading(false); // 업로드 상태를 마침
      successAlert(response.data.message);
      navigate(`/product/${response.data.content}`);
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
    };
  }, []);

  return (
    <Container>
      <Label>제품명</Label>
      <Input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>영문이름</Label>
      <Input
        ref={inputRef}
        type="text"
        value={englishTitle}
        onChange={(e) => setEnglishTitle(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>구성</Label>
      <Input
        ref={inputRef}
        type="text"
        value={configuration}
        onChange={(e) => setConfiguration(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>제품설명</Label>
      <Input
        ref={inputRef}
        type="text"
        value={oneLineIntroduce}
        onChange={(e) => setOneLineIntroduce(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>제품 유형</Label>
      <TypeContainer>
        <TypeBtn
          $isAcitve={productType === "화장품"}
          onClick={() => setProductType("화장품")}
        >
          화장품
        </TypeBtn>
        <TypeBtn
          $isAcitve={productType === "식품"}
          onClick={() => setProductType("식품")}
        >
          식품
        </TypeBtn>
      </TypeContainer>

      <Label>스토어 링크</Label>
      <Input
        ref={inputRef}
        type="text"
        value={storeLink}
        placeholder="ex) https://smartstore.naver.com/wonnature/products/xxxxx"
        onChange={(e) => setStoreLink(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>세부 내용 (생략가능)</Label>
      <ReactQuill //스타일은 index.css에서 수정
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        modules={modules}
        formats={formats}
      />
      <FileInputLabel htmlFor="file-upload">
        이미지 추가 (첫번째 이미지가 대표 이미지)
      </FileInputLabel>
      <FileInput
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <ImagePreview>
        {selectedFiles.map(({ file, url }, index) => (
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
        {isUploading
          ? "업로드 중..."
          : params.get("edit")
          ? "제품 수정"
          : "제품 등록"}
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

const TypeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const TypeBtn = styled.button<{ $isAcitve: boolean }>`
  width: 120px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  border: 0;
  text-align: center;
  padding: 13px 0;
  font-size: 1.15rem;
  border-radius: 15px;
  transition: all 0.5s;
  cursor: pointer;

  background-color: ${(props) =>
    props.$isAcitve ? "var(--base-color)" : "rgba(200, 255, 214, 0.2);"};

  &:hover {
    filter: contrast(340deg);
  }
  &:focus {
    border: none;
    outline: none;
  }
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

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 6px;
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

export default ProductFactory;
