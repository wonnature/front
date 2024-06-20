import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>HOME </div>} />
        {/* <Route path="/introduce/intro" element={} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
