import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import React from 'react';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchases" element={<Purchases />} />
      </Routes>
    </Router>
  )
}

export default App;