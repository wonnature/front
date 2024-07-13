import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../api";
import { warningAlert } from "../../components/Alert";
import { dateConvert } from "../../hooks/date-convert";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

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
  const user = useRecoilValue(userState);

  const navigate = useNavigate();

  const getNotices = async () => {
    try {
      const response = await api.get("/notice");
      setNotices(response.data.content);
    } catch (error: any) {
      warningAlert(error.response.data.message);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <Container>
      <LogoContainer>
        <img src="/images/community/title5_1.png" alt="logo" />
      </LogoContainer>
      {user?.role === "ADMIN" && (
        <ButtonContainer>
          <button onClick={() => navigate("/community/notice/write")}>
            공지 작성
          </button>
        </ButtonContainer>
      )}

      <NoticeListContainer>
        <NoticeContent>
          <div>번호</div>
          <div>제목</div>
          <div>작성일</div>
          <div>조회</div>
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
  height: auto;
  padding: 20px;

  @media screen and (max-width: 500px) {
    padding: 5px;
  }
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 10px;
  & button {
    background-color: var(--base-color);
    border-radius: 10px;
    color: white;
    padding: 8px 10px;
    border: 1px solid gray;
  }
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
    min-width: 30px;
    text-align: center;
    margin-right: 15px;
  }

  & div:nth-child(2) {
    //글제목
    min-width: 100px;
    flex-grow: 1;
  }

  & div:nth-child(2):hover {
    cursor: pointer;
    text-decoration-line: underline;
  }
  & div:nth-child(3) {
    //날짜
    min-width: 60px;
    text-align: center;
  }
  & div:nth-child(4) {
    //조회수
    min-width: 40px;
    text-align: center;
  }
`;

export default NoticeList;
