// src/components/Board.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { warningAlert } from "../../components/Alert";

interface BoardProps {
  id: number;
  content: string;
  isContentTop: boolean;
  pathName: string;
  imageUrls: string[];
  createdDate: string;
  lastModifiedDate: string;
}

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardProps | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await api.get(`/board?pathname=${location.pathname}`);
        if (response.data.content) setBoard(response.data.content);
        else {
          warningAlert("해당 게시판은 존재하지 않습니다.");
          navigate("/");
        }
      } catch (error: any) {
        warningAlert(error.response.data.message);
        navigate("/");
        console.error("Error fetching notice data:", error);
      }
    };

    fetchBoard();

    if (location.pathname === "/introduce/intro")
      setImgUrl("/images/intro/title1_1.png");
    if (location.pathname === "/introduce/greeting")
      setImgUrl("/images/intro/title1_12.png");
    if (location.pathname === "/introduce/purpose")
      setImgUrl("/images/intro/title1_2.png");
    if (location.pathname === "/introduce/history")
      setImgUrl("/images/intro/title1_3.png");
    if (location.pathname === "/introduce/business-field")
      setImgUrl("/images/intro/title1_4.png");
    if (location.pathname === "/quality-test/service")
      setImgUrl("/images/quality/quality_4_title.png");
    if (location.pathname === "/quality-test/result")
      setImgUrl("/images/quality/title4_1.png");
    if (location.pathname === "/quality-test/category")
      setImgUrl("/images/quality/quality_4_title.png");
    if (location.pathname === "/quality-test/apply")
      setImgUrl("/images/quality/title4_3.png");
  }, [location.pathname]);

  return (
    <BoardContainer>
      {board ? (
        <>
          <LogoContainer>
            <img src={imgUrl} alt="logo" />
          </LogoContainer>
          {user?.role === "ADMIN" && (
            <AdminButton onClick={() => navigate("/board/write")}>
              수정
            </AdminButton>
          )}
          {board?.isContentTop ? (
            <>
              {/* <BoardTitle>{board?.title}</BoardTitle> */}
              <BoardContent
                dangerouslySetInnerHTML={{ __html: board?.content }}
                className="ql-editor"
              />
              <ImageContainer>
                {board?.imageUrls.map((image) => (
                  <Image key={image} src={image}></Image>
                ))}
              </ImageContainer>
            </>
          ) : (
            <>
              <ImageContainer>
                {board?.imageUrls.map((image) => (
                  <Image src={image}></Image>
                ))}
              </ImageContainer>
              <BoardContent
                dangerouslySetInnerHTML={{ __html: board?.content }}
                className="ql-editor"
              />
            </>
          )}
        </>
      ) : (
        <>
          <LoadingSpinner />
        </>
      )}
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 20px 0;
`;

const AdminButton = styled.button`
  width: 100px;
  height: 35px;
  background-color: var(--base-color);
  border: 0;
  color: white;
`;

const BoardContent = styled.div`
  margin: 20px 0;
  font-size: 1.2em;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const Image = styled.img`
  align-self: center;
  max-width: 100%;
  width: 80%;
  margin: 10px 0;

  @media screen and (max-width: 600px) {
    width: 99%;
  }
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  margin-bottom: 30px;
`;

export default Board;
