import { useAuth } from "../contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth || !auth.token) {
    return <Navigate to="/" />;
  } else if (auth.user && auth.user.role_id != 1) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;