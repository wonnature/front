import styled from "styled-components";
import introData from "../../../public/service-list.json";

const Service = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/quality/quality_4_title.png" alt="logo" />
      </LogoContainer>

      {introData.intro.map((item, index) => (
        <div key={index}>
          <TitleImg src={item.titleImg} alt={`title-img-${index}`} />
          {item.content.map((text, idx) => (
            <StyledLi key={idx}>{text}</StyledLi>
          ))}
        </div>
      ))}
    </IntroContainer>
  );
};

export default Service;

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
  padding-bottom: 5px;
`;

const TitleImg = styled.img`
  padding: 20px 0;
`;

const StyledLi = styled.li`
  padding: 5px 10px;

  &::marker {
    color: green;
  }
`;
