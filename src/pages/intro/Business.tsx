import styled from "styled-components";
import companyIntroData from "../../../public/business-list.json";

const CompanyIntro = () => {
  return (
    <IntroContainer>
      <img src="/images/intro/title1_4.png" alt="logo" />

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

const TitleImg = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 30px;
`;

const NodeList = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
    padding-bottom: 10px;
  }

  li {
    display: flex;
    margin: 10px 0;

    h3 {
      font-weight: bold;
      margin-right: 0.5rem;
      white-space: nowrap;
      padding-right: 50px;

      &::before {
        content: "• ";
        color: green;
        margin-right: 0.5rem;
      }
    }
  }
`;

const StyledLi = styled.li`
  h3 {
    margin-bottom: 10px;
  }
`;

const ContentItem = styled.li`
  text-align: left;
  margin-left: 20px;
`;
