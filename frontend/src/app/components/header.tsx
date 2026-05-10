import { Logo } from "./logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import { Settings } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const canAccessModerationQueue = user?.role === "ADMIN" || user?.role === "SPECIALIST";
  const displayUserName = user?.displayName?.trim() || user?.nickname;

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <header className="py-4 px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => navigate("/")} className="cursor-pointer">
          <Logo />
        </button>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate("/report")}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Report
          </button>

          <button
            onClick={() => navigate("/forum")}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Support Forum
          </button>

          <button
            onClick={() => navigate("/knowledge-base")}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Knowledge Base
          </button>

          <button
            onClick={() => navigate("/crisis-help")}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Crisis Help
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Admin Users
              </button>

              <button
                onClick={() => navigate("/admin/audit-log")}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Audit Log
              </button>

              <button
                onClick={() => navigate("/admin/analytics")}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Admin Analytics
              </button>

            </>
          )}

          {canAccessModerationQueue && (
            <button
              onClick={() => navigate("/admin/forum-risk")}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Moderation Queue
            </button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                {displayUserName ? `Profile (${displayUserName})` : "Profile"}
              </button>

              <button
                onClick={() => navigate("/notifications")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Notifications
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/sign-in")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign in
              </button>

              <button
                onClick={() => navigate("/sign-up")}
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
