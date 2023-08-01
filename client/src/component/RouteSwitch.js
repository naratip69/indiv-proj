import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdvisorsList from "./AdvisorsList";
import StudentsList from "./StudentsList";
import StudentDetail from "./StudentDetail";
import AdvisorDetail from "./AdvisorDetail";
import StudentForm from "./StudentForm";
import AdvisorForm from "./AdvisorForm";

export default function RouteSwitch() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Sidebar />}>
          <Route path="/" element={<Navigate to="/students" />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/advisors" element={<AdvisorsList />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/student/:id/update" element={<StudentForm />} />
          <Route path="/student/create" element={<StudentForm />} />
          <Route path="/advisor/:id" element={<AdvisorDetail />} />
          <Route path="/advisor/create" element={<AdvisorForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
