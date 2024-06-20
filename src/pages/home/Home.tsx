import { useEffect } from "react";
import styled from "styled-components";

const Home = () => {
  useEffect(() => {
    console.log(window.history);
  }, []);
  return <Container></Container>;
};

const Container = styled.div`
  display: flex;
  width: 100vw;
`;

export default Home;
