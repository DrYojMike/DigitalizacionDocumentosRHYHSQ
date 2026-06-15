// Interfas que se utilizar culaquier archivo del proyecto
// Indicamos que (T = any) Puede ser cualquier cosa para un tipado dinamico
export interface ApiResponse<T = any> {
    // Indicamos que data puede ser cualquier respuesta de la peticion axios
    data: T;
    // Propiedad de caracter numerico sera
    status: number;
    // Propiedad que espeficica el estado de la peticon
    success: boolean;
    // Propiedad mensage que puede que exista o no
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

// Extend AxiosRequestConfig
declare module 'axios' {
    // al modelo axios añadimos AxiosRequestConfig
    export interface AxiosRequestConfig {
        metadata?: {
            startTime: number;
        };
    }
}