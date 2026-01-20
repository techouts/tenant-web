"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import type { User } from "@/lib/types";
import { mockUser } from "@/lib/data";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, you'd verify a token here
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
    setUser(loggedInUser);
    localStorage.setItem("userData", JSON.stringify(loggedInUser));
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

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/";
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
