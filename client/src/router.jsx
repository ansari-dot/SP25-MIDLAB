import React from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TourAdmin from "./Admin/TourAdmin/DashboardLayout.jsx";
const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tour-admin" element={<TourAdmin />} />
      </Routes>
    </div>
  );
};

export default Router;
