"use client";

import UserService from "@/api/UserService";
import { usePolling } from "@/app/_utils/polling.util";
import { LoginRequest, UserWithoutPassword } from "@athena/types";
import { redirect } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextProps {
  user: UserWithoutPassword | undefined | null;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isAuth: () => boolean
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithoutPassword | undefined | null>(null);

  const login = async (request: LoginRequest) => {
    await UserService.login(request).then(async (response) => {
      const token = response.data?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
        await UserService.me().then((res) => {
          setUser(res.data);
        })
      }
    }).catch((err) => {
      throw err;
    });
    redirect('/');
  };

  const logout = async () => {
    await UserService.logout().then(() => {
      setUser(null);
      localStorage.removeItem("access_token");
      redirect('/login');
    }).catch((err) => {
      throw err;
    });
  };

  const checkAuth = async () => {
    await UserService.me().then((res) => {
      setUser(res.data);
    }).catch(() => {
      setUser(null);
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  };

  usePolling(() => { checkAuth() }, 300000)

  const isAuth = () => {
    if (user) return true;
    else return false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth, isAuth } as AuthContextProps}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
