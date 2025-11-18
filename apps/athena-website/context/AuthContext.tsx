"use client";

import UserService from "@/api/UserService";
import { LoginRequest, User } from "@athena/types";
import { redirect } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextProps {
    user: User | null;
    login: (request: LoginRequest) => void;
    logout: () => void;
    checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (request: LoginRequest) => {
        UserService.login(request).then((response) => {
            const token = response.data?.access_token;
            if (token) {
                localStorage.setItem("access_token", token);
                UserService.me().then((res) => {
                    setUser(res);
                }).catch(() => {
                    setUser(null);
                });
                redirect('/');
            }
        }).catch((err) => {
            throw err;
        });
    };

    const logout = () => {
        UserService.logout().then(() => {
            localStorage.removeItem("access_token");
            setUser(null);
            redirect('/login');
        }).catch((err) => {
            throw err;
        });
    };

    const checkAuth = () => {
        UserService.me().then((res) => {
            setUser(res);
        }).catch(() => {
            setUser(null);
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth } as AuthContextProps}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);