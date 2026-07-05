"use client";

import { useEffect, useState } from "react";
import { sileo } from "sileo";
import { httpClient } from "@/app/services/api/client";
import { useAuth } from "@/app/context/AuthContext";
import { FaCheckCircle, FaClock, FaSave, FaStar } from "react-icons/fa";
import { Area } from "@/app/evaluaciones/types/GetEvaluation";
import { ApiResponse, ApiError } from "@/app/services/api/types";
interface Props {
  tipo: number;
}

interface RespuestaEvaluacion {
  indicador_id: number;
  nota: number;
}

export default function GetEvaluation({ tipo }: Props) {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const getEvaluacion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await httpClient.get<ApiResponse<Area[]>>(`evaluacion/formato/${tipo}/`);
      setData(response.data.data);
      sileo.success({
          description: response.data.message
      });
    } catch (err) {
      const error = err as ApiError
      console.error("Error al cargar evaluación:", error);
      sileo.error({
        title: `Error: ${error.status}`,
        description: error.message
      })
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const setRating = (indicador: number, valor: number) => {
    setRatings((prev) => ({
      ...prev,
      [indicador]: valor,
    }));
  };

  const guardarEvaluacion = async () => {
    if (!user) {
      sileo.warning({
        description:"Usuario no autenticado"
      });
      return;
    }

    if (Object.keys(ratings).length !== totalIndicadores) {
      sileo.warning({
        description:"Debe evaluar todos los indicadores."
      })
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const respuestas: RespuestaEvaluacion[] = Object.entries(ratings).map(
        ([indicador, nota]) => ({
          indicador_id: Number(indicador),
          nota: Number(nota),
        })
      );

      const payload = {
        idUsuario: user.id,
        respuestas,
      };

      const promise =  httpClient.post<ApiResponse>("evaluacion/evaluations/create/", payload);
      await sileo.promise(promise, {
      loading: {
        title: "Guardando evaluación...",
      },
      success: (response) => ({
        title: response.data.message ?? "Evaluación guardada correctamente",
      }),
      error: (err: unknown) => {
        if (
          typeof err === "object" &&
          err !== null &&
          "message" in err
        ) {
          return {
            title: (err as ApiError).message,
          };
        }

        return {
          title: "Ocurrió un error inesperado.",
        };
      },
      });
      await refreshUser();
      window.location.href ="/evaluaciones/dashboard";
      setRatings({});
    } catch (err) {
      const error = err as ApiError
      console.error("Error al guardar evaluación:", error);
      sileo.error({
        title: `Error: ${error.status}`,
        description: error.message
      })
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getEvaluacion();
  }, [tipo]);

  // Componente de Rating mejorado
  const Rating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
    return (
      <div className="flex gap-2 mt-3">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-10 h-10 rounded-full font-bold transition-all duration-200 flex items-center justify-center
              ${
                value === num ? "bg-red-600 text-white scale-110 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
              }
              `}
            >
            {num}
          </button>
        ))}
      </div>
    );
  };

  const totalIndicadores = data.reduce(
    (total, area) =>
      total +
      area.competencias.reduce(
        (cTotal, comp) => cTotal + comp.indicadores.length,
        0
      ),
    0
  );

  const evaluados = Object.keys(ratings).length;
  const porcentaje = totalIndicadores > 0 ? Math.round((evaluados / totalIndicadores) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header mejorado */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-red-600 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaStar className="text-red-600 text-2xl" />
                Evaluación de desempeño
              </h1>
              <p className="text-gray-500 mt-1">
                Califica cada indicador del 1 al 3
              </p>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl text-sm">
              <span className="text-gray-600">Progreso:</span>
              <span className="font-bold text-red-600 ml-2">
                {porcentaje}%
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Loading state mejorado */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4" />
            <p className="text-gray-600">Cargando evaluación...</p>
          </div>
        )}

        {/* Contenido principal */}
        {!loading && data.length > 0 && (
          <>
            {data.map((area, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <span className="bg-red-100 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {area.area}
                </h2>

                {area.competencias.map((comp, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md mb-5 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <h3 className="font-bold text-xl text-gray-800">
                        {comp.nombre}
                      </h3>
                      <p className="text-gray-500 mt-1">{comp.descripcion}</p>
                    </div>

                    <div className="p-5 space-y-4">
                      {comp.indicadores.map((ind) => (
                        <div
                          key={ind.id}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between flex-wrap gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {ind.nombre}
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm min-w-[180px]">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                                <FaStar className="text-yellow-500" />
                                Autoevaluación
                              </div>
                              <Rating
                                value={ratings[ind.id] ?? 0}
                                onChange={(v) => setRating(ind.id, v)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Footer sticky mejorado */}
            <div className="sticky bottom-4 bg-white rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <FaCheckCircle
                    className={`${
                      evaluados === totalIndicadores
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />
                  <span className="text-gray-600">
                    {evaluados} / {totalIndicadores} indicadores evaluados
                  </span>
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-gray-400" />
                  {evaluados === totalIndicadores
                    ? "¡Listo para guardar!"
                    : `Faltan ${totalIndicadores - evaluados}`}
                </span>
              </div>
              <button
                onClick={guardarEvaluacion}
                disabled={saving || evaluados !== totalIndicadores}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold
                  transition-all duration-300
                  ${
                    saving || evaluados !== totalIndicadores
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5"
                  }
                `}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Guardar evaluación
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && data.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay evaluaciones disponibles
            </h3>
            <p className="text-gray-500">
              No se encontraron indicadores para este tipo de evaluación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}