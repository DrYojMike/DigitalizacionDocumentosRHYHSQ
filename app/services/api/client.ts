//AxiosInstance: Nos permite modificar la instacia base de axios utilizarla de manera normal por defecto
//AxiosRequestConfig: Nos ayuda a configurar la opcion de request del cliente
//AxiosResponse: Nos permite configurar lo que queremos enviar 
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
// Importamos los tipos previamente creados anteriormente
import { ApiResponse, ApiError } from './types';

// Creamos la clase HttpClient para reutilizacion de codigo y mejores prtacticas
class HttpClient {
    // privatizamos el uso de la instancia, nadie fuera de la clase la puede utilizar
    // Objeto de axios parta las peticiones
    private instance: AxiosInstance;

    // Metodo que se ejecuta cuando creamos una instancia de la clase, indicamos que tendra un parametro de texto
    constructor(baseURL?: string) {
        // Acedemos a la instancia y creamos una peticion axios con la instancia
        this.instance = axios.create({
            // Indicamos que la url sera la pasada por parameytro, en caso de un existir sera por entorno virtualo por defecto
            baseURL: baseURL || process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
            // Indicamos el tiempo que la peticion espera la respuesta
            // Funcion que pasa de texto a numero parseInt
            timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
            // Formato de envio de datos
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Llamamos al metodo privado setupInterceptors
        this.setupInterceptors();
    }

    // Metdodo privado en cargado de hacer validaciones que no devuelve nada
    private setupInterceptors(): void {
        // De la instancia previamente creada accede a los interceptores de consulta y agrgamos un nuevo intercpetor
        this.instance.interceptors.request.use(
            // Pasamos la configuracion de la patecion y añadimos
            (config) => {
                // Obtenemos el token del localstorage
                const token = localStorage.getItem('access_token');
                // En caso de obtener el token lo añadimso al headers
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                //En la modificacion de axiso indicamos que puede existir metadata con su propiedad startTime
                // Indicamos que el inicio de ejecucion de la peticion es ahora
                config.metadata = { startTime: Date.now() };
                // Guardamos las nuevas configuraciones 
                return config;
            },
            // Manejo de errores
            (error: AxiosError) => {
                // Retorna el error obtenido y lo maneja con la funcion handleError
                return Promise.reject(this.handleError(error));
            }
        );

        // Añadimos otro interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Duraction sera el tiempo en el que se hizo la peticion - el tiempo en el que se obtuvo la respues
                const duration = Date.now() - (response.config.metadata?.startTime || 0);
                // si dura mas de un segundo
                if (duration > 1000) {
                    // Mensaje de precaucion
                    console.warn(`Slow request: ${response.config.url} took ${duration}ms`);
                }
                // devolvemos la respuesta 
                return response;
            },
            (error: AxiosError) => {
                // Retorna el error obtenido y lo maneja con la funcion handleError
                return Promise.reject(this.handleError(error));
            }
        );
    }

    // Funcion privatisada en donde indicamos que puede ser menssage
    // Indicamos que no sabemso que pueda ser nada, indicamos que si dentro de data existe menssage es string
    private hasMessage(data: unknown): data is { message: string } {
        // si la data es de tipo objeto y no es nulo y encontramos message en data
        return typeof data === 'object' && 
            data !== null && 
            'message' in data && 
            // data puede ser cualquier cosas pero message es un string
            typeof (data as any).message === 'string';
    }

    //Funcion privatisada de manejo de errores
    // Obtienei el error original de Axios y retorna la interfas de error creada por nosotros
    private handleError(error: AxiosError): ApiError {
        // Si hay algun error
        if (error.response) {
            // Obtenemos la informacion del error
            const data = error.response.data;
            // guarmaos el error
            let message = error.message;
            // Llamamos a la funcion que nos indica el errore de menssage
            if (this.hasMessage(data)) {
                // Reescribimos mensage
                message = data.message;
            }
            // Retornamos la informacion del error
            return {
                status: error.response.status,
                message: message,
                data: error.response.data,
            };
        // En caso de que el error este en request
        } else if (error.request) {
            return {
                status: 0,
                message: 'Network error - No response from server',
            };
        // Si el error no esta en ninguno
        } else {
            return {
                status: 0,
                message: error.message || 'Request configuration error',
            };
        }
    }

    // Funcion Asincronmica que ejecuta la peticion axios
    // T = any Tipo de datos que resivira
    // url: string Parametro obligatorio 
    // config?: AxiosRequestConfig Configuracion adicional
    // Promise<ApiResponse<T>> Retornara una estructura de datos como ApiResponse y la data puede ser cualquira
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        // 
        try {
            // Hace la peticion axios indicando el tipo de datos que recivira, pasando al configuracion y url
            const response = await this.instance.get<T>(url, config);
            // Retorna los datos, status y estado
            return {
                data: response.data,
                status: response.status,
                success: true,
            };
        // En caso de error llama a la funcion handleError
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }
}
// Exporta la creacion de una instancia para utilizarla en otro archivo
export const httpClient = new HttpClient();
// Exporta la clase para utilizarla en otro archivo
export default HttpClient;