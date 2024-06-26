import styled from "styled-components";

const Shipping = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/intro/pro_title_1.png" alt="logo" />
      </LogoContainer>

      <TitleImg>
        <img src="/images/intro/goods_custom.jpg" />
      </TitleImg>
    </IntroContainer>
  );
};

export default Shipping;

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
  margin-top: 20px;

  & img {
    max-width: 100%;
  }
`;
