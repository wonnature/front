import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../../api";
import { warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

const History = () => {
  const [history, setHistory] = useState("");
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const response = await api.get("/history");
      setHistory(response.data.content.content);
    } catch (error: any) {
      warningAlert(error.response.data.message);
    }
  };
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/intro/title1_3.png" alt="logo" />
      </LogoContainer>
      {user?.role === "ADMIN" && (
        <ButtonContainer>
          <button onClick={() => navigate("/introduce/history/write")}>
            연혁 수정
          </button>
        </ButtonContainer>
      )}
      <HistoryContent
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: history }}
      />
    </IntroContainer>
  );
};

export default History;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;
`;

const LogoContainer = styled.div`
  align-self: flex-start;
`;

const HistoryContent = styled.div`
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-start;
  margin: 15px 0 10px 10px;
  gap: 10px;
  & button {
    background-color: var(--base-color);
    border-radius: 10px;
    color: white;
    padding: 8px 10px;
    border: 1px solid gray;
  }
`;
