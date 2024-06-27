// src/components/Notice.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { dateTimeConvert } from "../../hoooks/date-convert";
import { warningAlert } from "../../components/Alert";

interface NoticeProps {
  id: number;
  title: string;
  content: string;
  fileUrls: string[];
  createdDate: string;
  lastModifiedDate: string;
}

const Notice: React.FC = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState<NoticeProps | null>(null);
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
            {user && (
              <button
                onClick={() =>
                  navigate(`/community/notice/write?edit=${notice.id}`)
                }
              >
                수정
              </button>
            )}
          </ButtonContainer>
          <NoticeContent
            dangerouslySetInnerHTML={{ __html: notice?.content }}
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
    width: 60px;
    padding: 8px 0;
    color: black;
    border: 1px solid gray;
  }
`;

const NoticeContent = styled.div`
  margin-bottom: 20px;
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
