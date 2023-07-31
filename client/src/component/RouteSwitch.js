import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdvisorsList from "./AdvisorsList";
import StudentsList from "./StudentsList";

export default function RouteSwitch() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/students" element={<StudentsList />} />
        <Route path="/advisors" element={<AdvisorsList />} />
      </Routes>
    </BrowserRouter>
  );
}
