import { useAuth } from "../hooks/useAuth";
import Loading from "../ux/Loading";
import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  const { data: user, isLoading, error } = useAuth();
  const accessToken = localStorage.getItem("token");

  if (isLoading) return <Loading />;

  if (error || !user?.id || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
