import React from "react";
import { Routes, Route } from "react-router-dom";
import Instructions from "./Pages/Instructions";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import StudentLogin from "./Pages/StudentLogin";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import TakeExam from "./Pages/TakeExam";
import AdminResults from "./Pages/AdminResults";
import StudentResult from "./Pages/StudentResult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/take-exam" element={<TakeExam />} />
      <Route path="/admin-results" element={<AdminResults />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/student-result" element={<StudentResult />} />
    </Routes>
  );
}

export default App;