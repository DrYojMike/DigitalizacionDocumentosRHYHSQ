export interface ApiResponse<T = any> {
    data: T;
    status: number;
    success: boolean;
    message?: string;
}

export interface ApiError {
    status: number;
    message: string;
    data?: any;
}

export interface RequestOptions {
    enabled?: boolean;
    retry?: number;
    retryDelay?: number;
    cacheTime?: number;
    staleTime?: number;
}

declare module "axios" {
    export interface AxiosRequestConfig {
        metadata?: {
            startTime: number;
        };
    }
}

export interface Permissions {
    evaluacion: boolean;
    empleadosCargo: boolean;
    tipoEvaluacion: number;
}

export interface User {
    id: string;
    documento: string;
    name: string;
    role: "ADMIN" | "EMPLEADO";
    permissions: Permissions;
}

export interface Tokens {
    access: string;
    refresh: string;
}

export interface LoginResponse {
    user: User;
    tokens: Tokens;
}