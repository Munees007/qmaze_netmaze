import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isLogined, children }: { isLogined: boolean; children: React.ReactNode }) => {
  if (!isLogined) {
    return <Navigate to="/" replace />; // Redirect to the homepage if not logged in
  }
  return <>{children}</>;
};

export default PrivateRoute;
