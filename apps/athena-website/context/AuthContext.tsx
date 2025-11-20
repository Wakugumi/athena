"use client";

import UserService from "@/api/UserService";
import { LoginRequest, UserWithoutPassword } from "@athena/types";
import { redirect } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextProps {
    user: UserWithoutPassword | undefined | null;
    login: (request: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
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
                }).catch(() => {
                    setUser(null);
                });
                redirect('/');
            }
        }).catch((err) => {
            throw err;
        });
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

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth } as AuthContextProps}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);