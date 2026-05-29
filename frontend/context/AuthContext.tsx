"use client";

import { AuthContextType, AuthMeResponse, UserProfile } from "@/types/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext<AuthContextType | null>(null);
axios.defaults.withCredentials = true;

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get<AuthMeResponse>("http://localhost:8000/api/auth/me");
                if (response.data.status === "success" && response.data.data.isSignedIn) {
                    setUser(response.data.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        }
        checkAuthStatus();
    }, []);

    const logout = async () => {
        try {
            setUser(null);
            localStorage.removeItem("token");
            window.location.href = '/';
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };


    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}