import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  console.log("User Role:", user?.role);  // Debugging log
  console.log("Allowed Roles:", allowedRoles);

  if (!user || !allowedRoles.includes(user.role)) {
    console.warn("Access Denied: Redirecting to /signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

