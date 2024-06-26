import styled from "styled-components";
import introData from "../../../public/apply-list.json";

const Apply = () => {
  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/quality/title4_3.png" alt="logo" />
      </LogoContainer>

      <DownloadButton
        href="https://wonnature.s3.ap-northeast-2.amazonaws.com/quality.hwp"
        download
      >
        <img src="/images/quality/download.jpg" />
      </DownloadButton>

      {introData.intro.map((item, index) => (
        <IntroItem key={index}>
          <TitleImgContainer>
            <img src={item.titleImg} alt={`title-img-${index}`} />
          </TitleImgContainer>
          <ContentsContainer>
            {item.contents.map((content, contentIndex) => (
              <ContentItem key={contentIndex}>
                <Title>
                  <ul>
                    <li>{content.title}</li>
                  </ul>
                </Title>
                <Info>
                  {typeof content.content === "string" ? (
                    <InfoItem>{content.content}</InfoItem>
                  ) : (
                    content.content.map((line, lineIndex) => (
                      <InfoItem key={lineIndex}>{line}</InfoItem>
                    ))
                  )}
                </Info>
              </ContentItem>
            ))}
          </ContentsContainer>
        </IntroItem>
      ))}

      <Procedure>
        <TitleImgContainer>
          <img src="/images/quality/quality_1_ti.png" />
        </TitleImgContainer>
        {introData.procedure.map((item, index) => (
          <ProcedureItem key={index}>
            <TitleImgContainers>
              <img src={item.titleimg} alt={`procedure-img-${index}`} />
            </TitleImgContainers>
            <ProcedureContent>
              <Title>
                <ul>
                  <li>{item.title}</li>
                </ul>
              </Title>
              <Info>
                {item.contents.map((line, lineIndex) => (
                  <InfoItem key={lineIndex}>{line}</InfoItem>
                ))}
              </Info>
            </ProcedureContent>
          </ProcedureItem>
        ))}
      </Procedure>
      <Foot>
        <TitleImgContainer>
          <img src="/images/quality/quality_3_ti_5.png" />
        </TitleImgContainer>
        <FootImg>
          <img src="/images/quality/quality_3_sub_1.jpg" />
        </FootImg>
      </Foot>
    </IntroContainer>
  );
};

export default Apply;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const IntroItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentItem = styled.div`
  margin-bottom: 10px;
`;

const Title = styled.div`
  & ul {
    padding-left: 10px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoItem = styled.div`
  margin-bottom: 5px;
`;

const Procedure = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const ProcedureItem = styled.div`
  display: flex;
  width: 100%;
  margin: 15px 0;
`;

const TitleImgContainer = styled.div`
  flex-basis: 30%;
  & img {
    max-width: 100%;
    height: auto;
  }
  padding-bottom: 10px;
`;
const TitleImgContainers = styled.div`
  flex-basis: 30%;
  & img {
    max-width: 100%;
    height: auto;
    padding-left: 30px;
  }
`;
const ProcedureContent = styled.div`
  flex-basis: 70%;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const Foot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-top: 50px;
`;

const FootImg = styled.div`
  margin-top: 20px;

  & img {
    max-width: 100%;
  }
`;

const DownloadButton = styled.a`
  cursor: pointer;
  border: 0;
  margin: 30px 0;
  & img {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
