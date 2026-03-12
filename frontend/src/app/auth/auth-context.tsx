import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../api/auth-api";
import { getToken, removeToken, saveToken } from "../lib/auth-storage";

export interface CurrentUser {
  email: string;
  nickname: string;
  role: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
  setUser: (user: CurrentUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      const existingToken = getToken();

      if (!existingToken) {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setIsInitializing(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setToken(existingToken);
          setUser(currentUser);
          setIsInitializing(false);
        }
      } catch {
        if (!cancelled) {
          removeToken();
          setToken(null);
          setUser(null);
          setIsInitializing(false);
        }
      }
    }

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (newToken: string, newUser: CurrentUser) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isInitializing,
      login,
      logout,
      setUser,
    }),
    [user, token, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}