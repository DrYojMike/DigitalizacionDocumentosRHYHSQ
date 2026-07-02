import axios,{AxiosInstance,AxiosRequestConfig,AxiosResponse,AxiosError}from "axios";
import {ApiResponse,ApiError}from "./types";


class HttpClient {
    private instance: AxiosInstance;
    constructor(baseURL?: string) {
        this.instance =
            axios.create({
                baseURL:
                    baseURL ??
                    process.env.NEXT_PUBLIC_URL ??
                    "http://localhost:3000/api",

                timeout: 30000,
                headers: {
                    "Content-Type":
                        "application/json"
                }
            });
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                config.metadata = {startTime: Date.now()};
                return config;
            }
        );
        this.instance.interceptors.response.use(
            (response) => {
                const duration = Date.now() - (response.config.metadata?.startTime ?? 0);
                if (duration > 1000) {
                    console.warn(`Slow request ${duration}ms`);
                }
                return response;
            },
            async (error: AxiosError) => {
                const original: any = error.config;
                if (error.response?.status === 401 &&!original?._retry){
                    original._retry = true;
                    const refresh = localStorage.getItem("refresh_token");
                    if (refresh) {
                        try {
                            const response = await axios.post(
                                `${this.instance.defaults.baseURL}auth/token/refresh/`,
                                    {
                                        refresh
                                    }
                                );
                            const {access,
                                refresh: newRefresh
                            } = response.data;

                            localStorage.setItem("access_token",access);

                            if (newRefresh) {
                                localStorage.setItem("refresh_token",newRefresh);
                            }
                            original.headers.Authorization =`Bearer ${access}`;
                            return this.instance(original);
                        } catch (e) {
                               localStorage.clear();
                                window.location.href = "/login";
                        }
                    }
                }
                return Promise.reject(
                    this.handleError(error)
                );
            }
        );
    }
    private handleError(error: AxiosError): ApiError {
        if (error.response) {
            return {
                status: error.response.status,
                message:(error.response.data as any)?.message ||error.message,
                data: error.response.data
            };
        }
        if (error.request) {
            return {status: 0,message:"Servidor no responde"};
        }
        return {status: 0, message: error.message};
    }
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.get<T>(url, config);
            return {
                data: response.data,
                status: response.status,
                success: true
            };
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }
    async post<T>(url: string,body?: any,config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.post<T>(url, body, config);
        return {
            data: response.data,
            status: response.status,
            success: true
        };
    }
    async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
        const response = await this.instance.put<T>(url,body);
        return {
            data: response.data,
            status: response.status,
            success: true
        };
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response = await this.instance.delete<T>(url);
        return {
            data: response.data,
            status: response.status,
            success: true
        };
    }
}

export const httpClient = new HttpClient();
export default HttpClient;