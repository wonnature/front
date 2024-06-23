import styled from "styled-components";

const Purpose = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/intro/title1_2.png" alt="logo" />
      </LogoContainer>

      <TitleImg>
        <img src="/images/intro/about_2_img.png" alt="logo" />
      </TitleImg>
      <SubImg>
        <ImageWrapper>
          <img src="/images/intro/about_2_pic_01.jpg" alt="logo" />
        </ImageWrapper>
        <ImageWrapper>
          <img src="/images/intro/about_2_pic_02.jpg" alt="logo" />
        </ImageWrapper>
        <ImageWrapper>
          <img src="/images/intro/about_2_pic_03.jpg" alt="logo" />
        </ImageWrapper>
      </SubImg>
      <StyledLi>
        <ul>
          <li>
            현장체험과 현장실습 교육의 기회를 제공하여 현장적응형 인재양성
          </li>
          <li>
            학생들의 교육과 교원들의 연구에 활용하여 개발된 기술을 민간부분에
            이전하여 사업화를 촉진
          </li>
          <li>
            화장품 제조시설 및 품질관리장비를 학생 현장실습 교육에 적극
            활용함으로써 현장적응형 인재를 양성하여 창업/취업률 향상 및 일자리
            창출에 기여
          </li>
        </ul>
      </StyledLi>
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

const LogoContainer = styled.div`
  align-self: flex-start;
`;

const TitleImg = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;

  & img {
    width: 100%;
  }
`;

const SubImg = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
`;

const ImageWrapper = styled.div`
  padding: 0 10px;
`;

const StyledLi = styled.div`
  & ul {
    padding-left: 5px;
  }
  li {
    padding: 5px 0;
  }
  li::marker {
    color: green;
  }
`;
