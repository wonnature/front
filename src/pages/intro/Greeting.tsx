import styled from "styled-components";

const Greeting = () => {
  return (
    <IntroContainer>
      <img src="/images/intro/title1_12.png" alt="logo" />
      <Content>
        <p>
          반갑습니다.
          <br />
          원광대학교 학교기업 원네이처를 찾아 주셔서 진심으로 감사드립니다.{" "}
          <br />
          원광대학교 학교기업인 원네이처는 교육부에서 지원하고
          한국산업기술진흥원이 주관하는 2015년 학교기업 지원사업에 선정되어
          설립되었습니다. 원네이처는 한약학과, 생명과학부, 생명환경화학과,
          식품생명공학과, 화학과 학생들의 현장실무능력 및 참여교원들의 연구력을
          향상시키고, 기술 이전 및 시제품제작 등에 주력하고 있으며, 학교기업에서
          운영하는 원료제료, 포장, 분석, 품질관리, 결산, 마케팅 과정에 학생을
          참여시킴으로서 학생의 취•창업능력 배양에 중점을 두고 있습니다. <br />
          '수피나'브랜드로 출시된 제품(마스크팩, 핸드크림, 클렌징폼, 샴푸,
          컨디셔너, 바디워시 등)은 원광대가 보유한 특허 기술을 기반으로 지역
          화장품 기업과 기술제휴하여 제품화하고, 참여교수와 현장실습생들이
          제품개발 전 과정에 직접 참여해 출시된 제품입니다. <br />
          원네이처는 현장실습과 창업교육에 참여한 학생들의 일자리 창출, 전북
          대표제품 개발 등을 통해 지역 경제 발전에 이바지 하도록 노력하겠습니다.
        </p>
        <h2>원네이처 대표</h2>
      </Content>
    </IntroContainer>
  );
};

export default Greeting;
const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Content = styled.div`
  width: 80%;
  margin-top: 2rem;

  h2 {
    text-align: right;
    margin-top: 2rem;
  }
`;
