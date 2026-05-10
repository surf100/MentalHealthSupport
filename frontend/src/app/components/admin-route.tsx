import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

export function AdminRoute({
  children,
  allowedRoles = ["ADMIN"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}
