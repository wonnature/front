import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Header from "./assets/components/Header";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<div>HOME </div>} />
        {/* <Route path="/introduce/intro" element={} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
