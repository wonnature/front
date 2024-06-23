import styled from "styled-components";
import resultData from "../../../public/result-table.json";

const Result = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/quality/title4_1.png" alt="logo" />
      </LogoContainer>
      <Title>
        <ul>
          <li>
            <h3>주요장비</h3>
            <p>품질검사 분석 및 원료제조 장비 총 50여종 80여대</p>
          </li>
        </ul>
      </Title>
      <img src="/images/quality/machine_2.jpg" alt="logo" />
      <Table>
        <thead>
          <tr>
            {resultData.headers.map((header, index) => (
              <th
                key={index}
                style={{ backgroundColor: "#f2f2f2" }} // 테이블 헤더를 회색으로 설정
              >
                {header.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resultData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.machine}</td>
              <td>{item.model}</td>
              <td>{item.manufacturer}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </IntroContainer>
  );
};

export default Result;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;

  & img {
    max-width: 100%;
  }
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const Title = styled.div`
  & ul {
    list-style-type: none;
    padding-left: 0; // ul 태그의 기본 padding-left 제거
  }

  & li {
    display: flex;
    margin: 10px 0;

    & h3 {
      font-weight: bold;
      margin-right: 0.5rem;
      white-space: nowrap;
      padding-right: 20px;

      &::before {
        content: "• ";
        color: green;
        margin-right: 0.5rem;
      }
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
`;
