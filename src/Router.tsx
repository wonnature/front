import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Header from "./assets/components/Header";

const CompanyIntro = lazy(() => import("./pages/intro/CompanyIntro"));
const Greeting = lazy(() => import("./pages/intro/Greeting"));
const Purpose = lazy(() => import("./pages/intro/Purpose"));
const History = lazy(() => import("./pages/intro/History"));
const Business = lazy(() => import("./pages/intro/Business"));
const Map = lazy(() => import("./pages/intro/Map"));
const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<div>HOME </div>} />
        <Route path="/introduce/intro" element={<CompanyIntro />} />
        <Route path="/introduce/greeting" element={<Greeting />} />
        <Route path="/introduce/purpose" element={<Purpose />} />
        <Route path="/introduce/history" element={<History />} />
        <Route path="/introduce/business-field" element={<Business />} />
        <Route path="/introduce/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
