import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <Container>
      <img src="/images/logo_f.png"></img>
      <div>우편번호 54538 전북 익산시 익산대로 460</div>
      <div>연락처: 063-850-5156</div>
      <div>팩스: 063-850-7378</div>
      <br />
      <div>ⓒ 2014 Wonkwang UNIVERSITY. all rights reserved</div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: var(--footer-height); //index.css에 변수선언 되어있음
  padding: 30px 0;
  background-color: #f7f7f7;
  color: gray;
  font-size: 0.8rem;
  text-align: center;
  border-top: 1px solid lightgray;

  & img {
    margin-bottom: 10px;
  }
`;

export default Footer;
