"use client"

import {createContext,useContext,useEffect,useState} from "react";
import { User } from "@/app/services/api/types";
import {authService}from "@/app/services/auth.service";
import { userService } from "@/app/services/user.service";

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    login: (username: string,password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);
export function AuthProvider({children}:{children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            setUser(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    const login = async (username: string,password: string) => {
        const data = await authService.login(username,password);
        setUser(data.user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await userService.getMe();
            setUser(response.data);
            localStorage.setItem("user",JSON.stringify(response.data));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{user, loading, login, logout,refreshUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro de AuthProvider");
    }
    return context;
}