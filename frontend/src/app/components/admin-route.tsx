import { Navigate } from "react-router";
import { useAuth } from "../auth/auth-context";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}