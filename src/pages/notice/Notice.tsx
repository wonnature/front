// src/components/Notice.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { dateTimeConvert } from "../../hooks/date-convert";
import { confirm, successAlert, warningAlert } from "../../components/Alert";
import { NoticeProps } from "../types/NoticeProps";

const Notice: React.FC = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState<NoticeProps | null>(null);
  const [isDeleteing, setIsDeleteing] = useState(false);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await api.get(`/notice/${id}`);
        setNotice(response.data.content);
      } catch (error: any) {
        warningAlert(error.response.data.message);
        navigate("/community/notice");
        console.error("Error fetching notice data:", error);
      }
    };

    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    if (isDeleteing) return; //삭제중이면 리턴

    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;
    else setIsDeleteing(true);
    try {
      await api.delete(`/notice/${id}`);
      setIsDeleteing(false);
      successAlert("글 삭제가 완료되었습니다.");
      navigate("/community/notice");
    } catch (error: any) {
      setIsDeleteing(false);
      const result = await warningAlert(error.response.data.message);
      console.log(result);
    }
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    const encodedFileName = parts[parts.length - 1];
    return decodeURIComponent(encodedFileName);
  };

  return (
    <NoticeContainer>
      {notice ? (
        <>
          <NoticeTitle>{notice?.title}</NoticeTitle>
          <FileList>
            {notice?.fileUrls.map((fileUrl, index) => (
              <FileItem key={index}>
                <img src="/images/disk_icon.png"></img>
                <FileLink href={fileUrl} download>
                  {getFileName(fileUrl)}
                </FileLink>
              </FileItem>
            ))}
          </FileList>
          <TimeContainer>
            <div>
              <span>작성일</span>
              <span>{dateTimeConvert(notice?.createdDate)}</span>
            </div>
            {notice.createdDate !== notice.lastModifiedDate && (
              <div>
                <span>수정일</span>
                <span>{dateTimeConvert(notice?.lastModifiedDate)}</span>
              </div>
            )}
          </TimeContainer>
          <hr></hr>
          <ButtonContainer>
            <button onClick={() => navigate("/community/notice")}>목록</button>
            {user?.role === "ADMIN" && (
              <>
                <button
                  onClick={() =>
                    navigate(`/community/notice/write?edit=${notice.id}`)
                  }
                >
                  수정
                </button>
                <button
                  style={{ background: "tomato" }}
                  onClick={() => handleDelete()}
                >
                  삭제
                </button>
              </>
            )}
          </ButtonContainer>
          <NoticeContent
            dangerouslySetInnerHTML={{ __html: notice?.content }}
            className="ql-editor"
          />
        </>
      ) : (
        <LoadingSpinner></LoadingSpinner>
      )}
    </NoticeContainer>
  );
};

const NoticeContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 20px 0;
`;

const NoticeTitle = styled.div`
  font-size: 2rem;
`;

const TimeContainer = styled.div`
  & div {
    display: flex;
    gap: 10px;
    color: gray;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 10px;
  & button {
    background-color: var(--base-color);
    border-radius: 6px;
    color: white;
    padding: 8px 15px;
    border: 1px solid gray;
  }
`;

const NoticeContent = styled.div`
  margin: 20px 0;
  font-size: 1.2em;
`;

const FileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FileItem = styled.li`
  margin-bottom: 10px;
`;

const FileLink = styled.a`
  margin-left: 5px;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default Notice;
