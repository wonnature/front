import styled from "styled-components";
// 현장실습
const Practice = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/community/title5_2.png" alt="logo" />
      </LogoContainer>
      <Lodelist>
        <li>
          <Title>
            <img src="/images/community/practice_1_ti.png" alt="logo" />
          </Title>
          <Content>
            <img src="/images/community/p1.png" alt="logo" />
          </Content>
        </li>
        <li>
          <Title>
            <img src="/images/community/practice_1_ti.png" alt="logo" />
          </Title>
          <Content>
            <img src="/images/community/p1.png" alt="logo" />
          </Content>
        </li>
        <li>
          <Title>
            <img src="/images/community/practice_1_ti.png" alt="logo" />
          </Title>
          <Content>
            <img src="/images/community/p1.png" alt="logo" />
          </Content>
        </li>
      </Lodelist>
    </IntroContainer>
  );
};

export default Practice;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  height: auto;
  padding: 20px;
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const Lodelist = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Title = styled.div`
  padding: 20px 0;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 30px;

  & img {
    max-width: 100%;
  }
`;
