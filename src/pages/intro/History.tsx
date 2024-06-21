import styled from "styled-components";
import historyData from "../../../public/history-list.json";

const Purpose = () => {
  return (
    <IntroContainer>
      <img src="/images/intro/title1_3.png" alt="logo" />
      <StyledList>
        {historyData.content.content.map((item, index) => (
          <HistoryItem key={index}>
            <HistoryLogo src={item.logo} alt={`History Logo ${index}`} />
            <HistoryDetails>
              {item.history.map((event, eventIndex) => (
                <HistoryEvent key={eventIndex}>
                  <HistoryNum>{event.num}</HistoryNum>
                  <HistoryContent>{event.content}</HistoryContent>
                </HistoryEvent>
              ))}
            </HistoryDetails>
          </HistoryItem>
        ))}
      </StyledList>
    </IntroContainer>
  );
};

export default Purpose;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;
`;
const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const HistoryItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;

const HistoryLogo = styled.img`
  margin-right: 20px;
`;

const HistoryDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const HistoryEvent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const HistoryNum = styled.div`
  font-weight: bold;
  margin-right: 10px;
`;

const HistoryContent = styled.div``;
