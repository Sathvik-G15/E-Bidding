import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const AdminRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user && user.role === "admin" ? element : <Navigate to="/admin/login" />;
};

export default AdminRoute;
