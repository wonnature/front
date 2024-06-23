import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import styled from "styled-components";
import Home from "./pages/home/Home";
import ProductList from "./pages/product/ProductList";
import TopBanner from "./components/TopBanner";

const CompanyIntro = lazy(() => import("./pages/intro/CompanyIntro"));
const Greeting = lazy(() => import("./pages/intro/Greeting"));
const Purpose = lazy(() => import("./pages/intro/Purpose"));
const History = lazy(() => import("./pages/intro/History"));
const Business = lazy(() => import("./pages/intro/Business"));
const Map = lazy(() => import("./pages/intro/Map"));

const Service = lazy(() => import("./pages/qualityTest/Service"));
const Result = lazy(() => import("./pages/qualityTest/Result"));
const Category = lazy(() => import("./pages/qualityTest/Category"));
const Apply = lazy(() => import("./pages/qualityTest/Apply"));
const ProductFactory = lazy(() => import("./pages/product/ProductFactory"));
const NotPageFound = lazy(() => import("./components/NotPageFound"));
const Login = lazy(() => import("./pages/user/Login"));
const Product = lazy(() => import("./pages/product/Product"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <TopBanner />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <BodyContainer>
          <Sidebar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Login />} />
            <Route path="/introduce">
              <Route path="intro" element={<CompanyIntro />} />
              <Route path="greeting" element={<Greeting />} />
              <Route path="purpose" element={<Purpose />} />
              <Route path="history" element={<History />} />
              <Route path="business-field" element={<Business />} />
              <Route path="map" element={<Map />} />
            </Route>

            <Route path="/product">
              <Route path="" element={<ProductList />} />
              <Route path=":id" element={<Product />} />
              <Route path="write" element={<ProductFactory />} />
            </Route>
            <Route path="/quality-test">
              <Route path="service" element={<Service />} />
              <Route path="result" element={<Result />} />
              <Route path="category" element={<Category />} />
              <Route path="apply" element={<Apply />} />
            </Route>
            <Route path="*" element={<NotPageFound />} />
          </Routes>
        </BodyContainer>
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
};

const BodyContainer = styled.section<{ $isHome: boolean }>`
  display: flex;
  position: relative;
  width: 100%;
  flex-flow: row nowrap;
  min-height: calc(100dvh - (var(--header-height) + var(--footer-height)));
  justify-content: center;
  align-items: flex-start;
  background-color: white;
  gap: 20px;
  padding: "15px";
`;

export default Router;
