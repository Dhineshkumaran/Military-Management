import { Routes, Route } from "react-router-dom";
import React from 'react';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import Expenditures from "./pages/Expenditures";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import Logs from "./pages/Logs";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AuthProvider>
        <Navbar currentPath={location.pathname} onNavigate={navigate} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
          <Route path="/expenditures" element={<ProtectedRoute><Expenditures /></ProtectedRoute>} />
          <Route path="/signup" element={<AdminRoute><Signup /></AdminRoute>} />
          <Route path="/logs" element={<AdminRoute><Logs /></AdminRoute>} />
        </Routes>
    </AuthProvider>
  )
}

export default App;