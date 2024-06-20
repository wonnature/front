import React from "react";
import styled from "styled-components";
import companyIntroData from "../../../public/intro-list.json";

const CompanyIntro = () => {
  return (
    <IntroContainer>
      <img src={companyIntroData.logo} alt="logo" />
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
            <li key={index}>
              <img src={item.title} />
              <img src={item.image} />
            </li>
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
  align-items: center;

  &::before {
    content: "• ";
    color: green;
    margin-right: 0.5rem;
  }

  h3 {
    font-weight: bold;
    margin-right: 0.5rem;
  }

  p {
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
