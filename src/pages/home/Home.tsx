import { useEffect } from "react";
import styled from "styled-components";

const Home = () => {
  useEffect(() => {
    console.log(window.history);
  }, []);
  return (
    <Container>
      <div>hi</div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  /* width: 100vw; */
  color: black;
`;

export default Home;
