import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Header from "./assets/components/Header";
import Footer from "./assets/components/Footer";
import LoadingSpinner from "./assets/components/LoadingSpinner";
import styled from "styled-components";
import Home from "./pages/home/Home";

const CompanyIntro = lazy(() => import("./pages/intro/CompanyIntro"));
const Greeting = lazy(() => import("./pages/intro/Greeting"));
const Purpose = lazy(() => import("./pages/intro/Purpose"));
const History = lazy(() => import("./pages/intro/History"));
const Business = lazy(() => import("./pages/intro/Business"));
const Map = lazy(() => import("./pages/intro/Map"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <BodyContainer>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/introduce">
              <Route path="intro" element={<CompanyIntro />} />
              <Route path="greeting" element={<Greeting />} />
              <Route path="purpose" element={<Purpose />} />
              <Route path="history" element={<History />} />
              <Route path="business-field" element={<Business />} />
              <Route path="map" element={<Map />} />
            </Route>
          </Routes>
        </BodyContainer>
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
};

const BodyContainer = styled.section`
  display: flex;
  position: relative;
  width: 100%;
  flex-flow: row nowrap;
  min-height: calc(100dvh - (var(--header-height) + var(--footer-height)));
  justify-content: center;
  align-items: center;
  background-color: white;
  gap: 20px;
  padding: 15px;
`;

export default Router;
