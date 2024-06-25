// src/components/Notice.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import api from "../../api";

interface NoticeProps {
  title: string;
  content: string;
  fileUrls: string[];
}

const Notice: React.FC = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState<NoticeProps | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await api.get(`/notice/${id}`);
        setNotice(response.data.content);
      } catch (error) {
        console.error("Error fetching notice data:", error);
      }
    };

    fetchNotice();
  }, [id]);

  const getFileName = (url: string) => {
    const parts = url.split("-");
    const encodedFileName = parts[parts.length - 1];
    return decodeURIComponent(encodedFileName);
  };

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts[parts.length - 1];
  };

  if (!notice) {
    return <div>Loading...</div>;
  }

  return (
    <NoticeContainer>
      <h1>{notice?.title}</h1>
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
      <hr></hr>
      <NoticeContent dangerouslySetInnerHTML={{ __html: notice.content }} />
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
