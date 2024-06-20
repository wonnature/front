import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Header from "./assets/components/Header";
import Footer from "./assets/components/Footer";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<div>HOME </div>} />
        {/* <Route path="/introduce/intro" element={} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
