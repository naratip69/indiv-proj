import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdvisorsList from "./AdvisorsList";
import StudentsList from "./StudentsList";

export default function RouteSwitch() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Sidebar />}>
          <Route path="/" element={<Navigate to="/students" />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/advisors" element={<AdvisorsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
