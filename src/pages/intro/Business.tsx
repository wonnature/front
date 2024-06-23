import styled from "styled-components";
import companyIntroData from "../../../public/business-list.json";

const CompanyIntro = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/intro/title1_4.png" alt="logo" />
      </LogoContainer>

      <TitleImg>
        <img src="/images/intro/about_4_img.png" alt="logo" />
      </TitleImg>
      <NodeList>
        <ul>
          {companyIntroData.intro.map((item, index) => (
            <StyledLi key={index}>
              <h3>{item.title}</h3>
              <ul>
                {item.content.map((contentItem, contentIndex) => (
                  <ContentItem key={contentIndex}>{contentItem}</ContentItem>
                ))}
              </ul>
            </StyledLi>
          ))}
        </ul>
      </NodeList>
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
const TitleImg = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;

  & img {
    max-width: 100%;
  }
`;

const NodeList = styled.div`
  & ul {
    list-style-type: none;
    padding: 5px 0;
    text-align: left;
  }

  & li {
    display: flex;
    margin: 10px 0;
  }

  & h3 {
    display: flex;
    font-weight: bold;
    margin-right: 0.5rem;
    white-space: pre-line;
    padding-right: 20px;
    margin-left: 5px;
    min-width: 200px;
    margin-bottom: 10px;

    &::before {
      content: "• ";
      color: green;
      margin-right: 0.5rem;
    }
  }

  @media screen and (max-width: 500px) {
    & h3 {
      width: 120px;
      min-width: 120px;
    }
  }
`;

const StyledLi = styled.li`
  & h3 {
  }
`;

const ContentItem = styled.li`
  text-align: left;
  margin-left: 20px;
`;
