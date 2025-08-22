import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth || !auth.token) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default ProtectedRoute;