import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../api";
import { warningAlert } from "../../components/Alert";
import { dateConvert } from "../../hoooks/date-convert";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
        <NoticeContent>
          <div>번호</div>
          <div>제목</div>
          <div>작성일</div>
          <div>조회수</div>
        </NoticeContent>
        {notices?.map((notice) => (
          <NoticeContent key={notice.id}>
            <div>{notice.id}</div>
            <div onClick={() => navigate(`/community/notice/${notice.id}`)}>
              {notice.title}{" "}
              {notice?.fileUrls?.length > 0 && (
                <img src="/images/disk_icon.png"></img>
              )}
            </div>
            <div>{dateConvert(notice.createdDate)}</div>
            <div>{notice.hit}</div>
          </NoticeContent>
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

const NoticeContent = styled.div`
  display: flex;
  gap: 5px;
  padding: 10px;
  border-bottom: 1px solid lightgray;

  &:nth-child(1) {
    background-color: #aed676;
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

  & div:nth-child(2):hover {
    cursor: pointer;
    text-decoration-line: underline;
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
