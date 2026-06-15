// services/api/hooks/useAxiosGet.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {httpClient} from '../api/client';
import { ApiResponse, ApiError, RequestOptions } from '../api/types';

// Iterface en donde estar el estadod e la request
interface UseAxiosGetState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    }

// Interface que especifica el tiempo en cache que etsar una informacion
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

// Clase para guardar datos en cache
class QueryCache {
    // Objeto privatizado en donde especificamos que sera Map(Diccionario) y guuaradra datos de cache(puede ser cualquier dato)
    private cache = new Map<string, CacheEntry<any>>();
    // Objeto privatizado en donde especificamos que sera Map(Diccionario) sera un objeto Set que guarda cualquier dato y no retorna nada
    private subscribers = new Map<string, Set<(data: any) => void>>();

    // metodo get donde le pasamos la clave en string y este nos retorna cualquier informacion o null
    get<T>(key: string): T | null {
        // Obtenemos el dato con la clave
        const entry = this.cache.get(key);
        // retornamos null
        if (!entry) return null;
        // retornamos la data
        return entry.data as T;
    }

    // Metodo para agregar cache pasamos la mmave en forma de string
    // Pasamos la data que puede ser cualquier estructura de datos
    // indicamos que el tiempo en cahe se de 35 segundos y no retorna nada de informacion
    set<T>(key: string, data: T, cacheTime: number = 5 * 60 * 1000): void {
        // agregamos la informacion al cache pasando la llave
        this.cache.set(key, {
            // data asociada a la llave
            data,
            // Tiempo en el cual va a estar eseo datops en cache
            timestamp: Date.now() + cacheTime,
        });
        // Llamamos a lafuncion pasando los argumento
        this.notifySubscribers(key, data);
    }

    // Funcion de validacion que returnara falso o verdadero
    isValid(key: string): boolean {
        // Entreda los datos asociados a ala key
        const entry = this.cache.get(key);
        // soi no encontramos datos retornamos false
        if (!entry) return false;
        // De lo contrario Verificamos que el tiempo en cache no se haya pasado
        return Date.now() < entry.timestamp;
    }

    // Funcion que recive como argumento una llave, una funcion que resive parametros de data(Puede ser cualquier cosa) y no retorna nada
    subscribe(key: string, callback: (data: any) => void): () => void {
        // Si no existe alguna llave igual registramos la llave
        if (!this.subscribers.has(key)) {
            // Se registra la llave
            this.subscribers.set(key, new Set());
        }
        // Si ya existe una llave se añade la funcion
        this.subscribers.get(key)!.add(callback);
        // Si la llave existe eliminamos la funcion
        return () => {
            this.subscribers.get(key)?.delete(callback);
        };
    }

    // Funcion privatisada que recive llave y data y no retorna nada
    private notifySubscribers(key: string, data: any): void {
        // Llama a la instancia con el metodo get verificando que tenga la llave
        // Si enceuntra la key ejecuta el callback(Funcion asociada)
        this.subscribers.get(key)?.forEach(callback => callback(data));
    }
    // Funcion de limpieza que no retorn nada
    clear(): void {
        // Limpiamos El cache
        this.cache.clear();
        // Y limpiamos subscribes ()Eliminando llaves y callbacks
        this.subscribers.clear();
    }
}

// Cramos una instancia de QueryCache
const queryCache = new QueryCache();

// Hook personalizado para realizar peticiones GET utilizando Axios.
// Retorna el estado de la petición, los datos obtenidos y funciones
// para volver a ejecutar la consulta o invalidar la caché.
export function useAxiosGet<T = any>(
    // Solicita url para laconsulta
    url: string,
    // Opciones de configuración de la petición.
    options: RequestOptions = {}
    // Retorna el estado de la petición junto con:
    // - refetch(): vuelve a ejecutar la consulta.
    // - invalidate(): invalida la información almacenada en caché.
): UseAxiosGetState<T> & { refetch: () => Promise<void>; invalidate: () => void } {
    // Inicializacion de variables
    const {
        // Activado
        enabled = true,
        // Intentos
        retry = 2,
        // Tiempo de espera para los intentos
        retryDelay = 1000,
        // Tiempo de cache
        cacheTime = 5 * 60 * 1000, // 5 minutes
        // Tiempo de caducidad
        staleTime = 30 * 1000, // 30 seconds
    // Destructuracion todo va a estar en options
    } = options;

    const [state, setState] = useState<UseAxiosGetState<T>>(() => {
        // Initial state from cache
        const cachedData = queryCache.get<T>(url);
        // Si nos devuelve informacion(data) y retorna un true
        if (cachedData && queryCache.isValid(url)) {
            // Devolvemos la infromacion del cache
            return {
                // Informacion de estado de peticioon
                data: cachedData,
                // No esta cargando por que ya tenemos la informacion
                loading: false,
                // No hay error por que todo salio bien
                error: null,
                // El estado es satisfecha
                status: 'success',
            };
        }
        // De lo contrario retornamos 
        return {
            // No hay data
            data: null,
            // Cargaondo
            loading: enabled,
            // Error null
            error: null,
            // Inactivo
            status: 'idle',
        };
    });
    // Inicializamos los instentos a 0
    // useRef nos ayuda a no tener que renderizar cada vez que cambia el valor
    const retryCountRef = useRef(0);
    // Inicializamos abortControllerRef para evitar que la peticiones viejas se hagan
    const abortControllerRef = useRef<AbortController | null>(null);
    // Inicializamos si el compoenete esta subido
    const isMountedRef = useRef(true);

    // Inicializamos una funcion
    // Indicamos que la funcion se grabara una funcion
    // La funcion sera asincrona
    // Solicita si saltamos el cache por defecto es false
    // Retorna una promesa y no devuelve ningun valor
    const fetchData = useCallback(async (skipCache = false): Promise<void> => {
        // Verificamos el cache 
        if (!skipCache && queryCache.isValid(url)) {
            // Obtenemos la infromacion de cache
            const cachedData = queryCache.get<T>(url);
            // En caso de obtener los datos
            if (cachedData) {
                // Actualizamos el estado de la peticio
                setState({
                    data: cachedData,
                    loading: false,
                    error: null,
                    status: 'success',
                });
                return;
            }
        }

        // Cancelamos la peticion
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Volvemos a inicializar el bortController
        abortControllerRef.current = new AbortController();
        // Actualizamos el estado de la peticion
        setState(prev => ({ ...prev, loading: true, status: 'loading', error: null }));

        try {
            // Hacemos una peticion utilizamos la instancia y pasamos la url
            // Tambien pasamos la señal de abortControllerRef para evitar que se haga la peticion inecesariamente
            const response = await httpClient.get<T>(url, {
                signal: abortControllerRef.current.signal,
            });
            // En caso de que la señal sea falsa detenemos la peticion
            if (!isMountedRef.current) return;

            // Update cache
            queryCache.set(url, response.data, cacheTime);

            setState({
                data: response.data,
                loading: false,
                error: null,
                status: 'success',
            });

            retryCountRef.current = 0;
        } catch (error) {
            // Detenemos la peticion
            if (!isMountedRef.current) return;
            // Obtenemos el error
            const apiError = error as ApiError;

            // Retry logic
            if (retryCountRef.current < retry && apiError.status >= 500) {
                // Sumamos un intento
                retryCountRef.current++;
                // Funcion`que se ejecuta despues de cierto tiempo
                setTimeout(() => {
                    // Si el valor de verdadero
                    if (isMountedRef.current) { 
                        // vuelve a ejecutar la consulta
                        fetchData(skipCache);
                    }
                    // Tiempo para vollver a ejecutar la consulta
                }, retryDelay * retryCountRef.current);
                return;
            }
            // Actualiza la data
            setState({
                data: null,
                loading: false,
                error: apiError,
                status: 'error',
            });
        }
        // Indicamos que la funcion espera estos parametros
    }, [url, retry, retryDelay, cacheTime]);
    // Funcion que refresca la peticion
    const refetch = useCallback(async () => {
        await fetchData(true);
    }, [fetchData]);
    // Funcion que obtiene un funcion
    const invalidate = useCallback(() => {
        // Limpia el cache
        queryCache.clear();
        // Ejecuta la funcion de la peticion
        fetchData(true);
    }, [fetchData]);

    
    useEffect(() => {
        isMountedRef.current = true;
    
    if (enabled && url) {
        fetchData(false);
    }

    // se crea una funcion la quitar el cache
    // subscribe(url, (newData: T) est escucha si los datos cambiaron
    const unsubscribe = queryCache.subscribe(url, (newData: T) => {
        // Verifica si el componente sigue funcionando
        if (isMountedRef.current) {
            // En caso de que si 
            setState(prev => ({
                // hace uns pre carga de el ultimo estado de los datos
                ...prev,
                // Remplaza los datos y estados
                data: newData,
                loading: false,
                status: 'success',
            }));
            }
        });
        //  funcion que se ejcuta cuando el componente no est amontado o cambia alguna dependencia
        return () => {
            isMountedRef.current = false;
            unsubscribe();
            // Si hay alguna peticion la cancela
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
        // Se ejecutar la funcion cuando cambien las dependencias
    }, [url, enabled, fetchData]);

    // Permite retornar funciones para refresacar la consulta manuelamente y tambien permite hacer una peticion nuieva a el servido
    return {
        ...state,
        refetch,
        invalidate,
    };
}