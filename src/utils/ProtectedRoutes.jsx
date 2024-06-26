import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const localStorageToken = localStorage.getItem("backoffice-ma-token");

  return localStorageToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
