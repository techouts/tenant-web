"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import type { User } from "@/lib/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: (data: any, token: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("userData");
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const login = async (data: any) => {
    const response = await api.auth.login(data);
    const loggedInUser = { ...response };
    const { accessToken, refreshToken, ...rest } = loggedInUser;
    setUser(rest);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userData", JSON.stringify(rest));
    if (loggedInUser?.user?.role === "admin") {
      router.push("/admin");
    } else {
      window.location.href = "/dashboard";
    }
  };

  const signup = async (data: any) => {
    const response = await api.auth.signup(data);
    if (Boolean(response)) {
      window.location.href = "/login";
    }
  };

  const logout = async (data: any, token: any) => {
    const response = await api.auth.logout(data, token);
    if (!response?.error) {
      setUser(null);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
