import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../api";
import { warningAlert } from "../../components/Alert";
import { dateConvert } from "../../hoooks/date-convert";

interface Notice {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  fileUrls: [string];
  hit: number;
}

const NoticeList: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  const getNotices = async () => {
    try {
      const response = await api.get("/notice");
      setNotices(response.data.content);
    } catch (error) {
      warningAlert(error.response.data.message);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <Container>
      <Title>공지사항</Title>
      <NoticeListContainer>
        <Notice>
          <div>번호</div>
          <div>제목</div>
          <div>작성일</div>
          <div>조회수</div>
        </Notice>
        {notices?.map((notice) => (
          <Notice>
            <div>{notice.id}</div>
            <div>
              {notice.title}{" "}
              {notice?.fileUrls && <img src="/images/disk_icon.png"></img>}
            </div>
            <div>{dateConvert(notice.createdDate)}</div>
            <div>{notice.hit}</div>
          </Notice>
        ))}
      </NoticeListContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
`;

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
`;

const NoticeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 10px; */
  margin: 20px 0;
`;

const Notice = styled.div`
  display: flex;
  gap: 5px;
  padding: 10px;
  border-bottom: 1px solid lightgray;

  &:nth-child(1) {
    background-color: #bff1bc;
    border-radius: 15px 15px 0px 0px;
  }

  & div:nth-child(1) {
    //번호
    width: 35px;
    text-align: center;
    margin-right: 15px;
  }

  & div:nth-child(2) {
    //글제목
    min-width: 150px;
    flex-grow: 1;
  }
  & div:nth-child(3) {
    //날짜
    width: 80px;
    text-align: center;
  }
  & div:nth-child(4) {
    //조회수
    width: 60px;
    text-align: center;
  }
`;

export default NoticeList;
