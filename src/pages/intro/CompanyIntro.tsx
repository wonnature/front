import styled from "styled-components";
import companyIntroData from "../../../public/intro-list.json";

const CompanyIntro = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src={companyIntroData.logo} alt="logo" />
      </LogoContainer>
      <NodeList>
        <ul>
          {companyIntroData.intro.map((item, index) => (
            <StyledLi key={index}>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </StyledLi>
          ))}
        </ul>
      </NodeList>
      <Content>
        <ul>
          {companyIntroData.images.map((item, index) => (
            <ContentImage key={index}>
              <img src={item.title} />
              <img src={item.image} />
            </ContentImage>
          ))}
        </ul>
      </Content>
    </IntroContainer>
  );
};

export default CompanyIntro;

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

const NodeList = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
  }
`;

const StyledLi = styled.li`
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-top: 30px;

  &::before {
    content: "• ";
    color: green;
    margin-right: 0.5rem;
  }

  h3 {
    font-weight: bold;
    min-width: 100px;
    white-space: nowrap;
    text-align: left;
    margin: 0;
  }

  p {
    text-align: left;
    margin: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ul {
    list-style-type: none;
    padding: 0;
  }
`;

const ContentImage = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;

  img {
    margin-top: 10px;
    max-width: 100%;
  }
`;
