import { httpClient } from "@/app/services/api/client";
import { LoginResponse } from "@/app/services/api/types";

class AuthService {

    isAuthenticated() {
        return !!localStorage.getItem("access_token");
    }

    hasEvaluationPermission() {
        const user = this.getUser();
        return (user?.permissions?.evaluacion ?? false);
    }

    hasEmployeesInCharge() {
        const user = this.getUser();
        return (user?.permissions?.empleadosCargo ?? false);
    }

    async login(username: string,password: string): Promise<LoginResponse> {
        const response = await httpClient.post<LoginResponse>("auth/Login/",
                {
                    username,
                    password
                }
            );
        const data = response.data;

        localStorage.setItem("access_token",data.tokens.access);
        localStorage.setItem("refresh_token",data.tokens.refresh);
        localStorage.setItem("user",JSON.stringify(data.user));

        return data;
    }

    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href ="/";
    }

    getUser() {
        const user =localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
}

export const authService = new AuthService();