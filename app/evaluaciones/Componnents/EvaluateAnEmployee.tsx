"use client";

import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import { useAuth } from "@/app/context/AuthContext";
import { FaStar, FaCheckCircle, FaClock, FaSave, FaPlus, FaUser, FaUserTie,FaChartLine,FaArrowLeft} from "react-icons/fa";
import Link from "next/link";
import { ApiResponse, ApiError} from "@/app/services/api/types";
import { Evaluacion } from "@/app/evaluaciones/types/EvaluateAnEmployee";
import { sileo } from "sileo";
interface Props {
  idevageneral: number;
}

export default function EvaluateAnEmployee({ idevageneral}: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<Evaluacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [compromisos, setCompromisos] = useState<string[]>([""]);

  const agregarCompromiso = () => {
    setCompromisos([...compromisos, ""]);
  };

  const actualizarCompromiso = (index: number, valor: string) => {
    const copia = [...compromisos];
    copia[index] = valor;
    setCompromisos(copia);
  };

  const eliminarCompromiso = (index: number) => {
    if (compromisos.length > 1) {
      const copia = compromisos.filter((_, i) => i !== index);
      setCompromisos(copia);
    }
  };

  const compromisosLimpios = compromisos.filter((c) => c.trim() !== "");

  const getEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await httpClient.get<ApiResponse<Evaluacion>>(
        `evaluacion/autoevaluacion/empleado/${idevageneral}/`
      );
      setData(response.data.data);
      const evaluacion = response.data.data;
      if (evaluacion) {
        sileo.success({
          description: response.data.message,
        });
      } else {
        sileo.warning({
          description: "El empleado no cuenta con la AutoEvaluación realizada",
        });
      }
    } catch (err) {
      const error = err as ApiError
      console.error("Error al cargar evaluación:", error);
      sileo.error({
        title: `Error: ${error.status}`,
        description: error.message
      })
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvaluation();
  }, [idevageneral]);

  const setRating = (indicadorId: number, nota: number) => {
    setRatings((prev) => ({
      ...prev,
      [indicadorId]: nota,
    }));
  };

  // Componente Rating mejorado
  const Rating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3].map((num) => (
          <button
            key={num} type="button"
            onClick={() => onChange(num)} className={`w-10 h-10 rounded-full font-bold transition-all duration-200 flex items-center justify-center
              ${
                value === num
                  ? "bg-red-600 text-white scale-110 shadow-md ring-2 ring-red-300 ring-offset-2"
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

  const totalIndicadores =
    data?.areas?.reduce(
      (total, area) =>
        total +
        area.competencias.reduce(
          (compTotal, comp) => compTotal + comp.indicadores.length,
          0
        ),
      0
    ) ?? 0;

  const evaluados = Object.keys(ratings).length;
  const porcentaje = totalIndicadores > 0 ? Math.round((evaluados / totalIndicadores) * 100) : 0;

  const guardarEvaluacion = async () => {
    if (!data) {
      sileo.warning({
        description: "No existe información de evaluación."
      })
      return;
    }

    if (!data.idEmpleado || !data.idJefe) {
      sileo.warning({
        description: "No existe empleado o jefe asociado."
      })
      return;
    }

    if (Object.keys(ratings).length !== totalIndicadores) {
      sileo.warning({
        description: "Debe calificar todos los indicadores."
      })
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const respuestas = Object.entries(ratings).map(([idIndicador, nota]) => ({
        idEva: data.idEvaluacion,
        idJefe: data.idJefe,
        idEmp: data.idEmpleado,
        nota,
        idIndicador: Number(idIndicador),
      }));

      const payload = {
        respuestas,
        compromisos: compromisos.filter((c) => c.trim() !== ""),
      };

      await httpClient.post("evaluacion/evaluar-empleado/", payload);
      sileo.success({
        description: "Evaluación guardada exitosamente"
      })
      window.location.href ="/evaluaciones/dashboard";
      setRatings({});
      setCompromisos([""]);
    } catch (err) {
      const error = err as ApiError
      console.error("Error guardando evaluación:", error);
      sileo.error({
        title:`Error: ${error.status}`,
        description: error.message
      })
    } finally {
      setSaving(false);
    }
  };

  // Loading State mejorado
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600" />
          <p className="text-gray-600 font-medium">Cargando evaluación...</p>
        </div>
      </div>
    );
  }

  // Empty State mejorado
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Sin autoevaluación
          </h3>
          <p className="text-gray-500">
            El usuario seleccionado aún no ha realizado la autoevaluación.
          </p>
          <Link
            href={`/evaluaciones/dashboard/listPendiente/${user?.documento}`}
            className="inline-block mt-6 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-red-600 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/dashboard/evaluaciones"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <FaArrowLeft className="text-sm" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <FaStar className="text-red-600 text-2xl" />
                  Evaluación de Desempeño
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <FaChartLine className="text-gray-400" />
                  Evaluación #{data.idEvaluacion}
                </span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span className="text-gray-500">
                  📅 {data.fecha}
                </span>
              </div>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl text-sm min-w-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progreso:</span>
                <span className="font-bold text-red-600">{porcentaje}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {evaluados} / {totalIndicadores}
              </div>
            </div>
          </div>
        </div>
        {/* Áreas y Competencias */}
        {data.areas.map((area, areaIndex) => (
          <div key={area.idArea} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="bg-red-100 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                {areaIndex + 1}
              </span>
              {area.area}
            </h2>

            {area.competencias.map((comp) => (
              <div
                key={comp.idCompetencia}
                className="bg-white rounded-xl shadow-md mb-5 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-xl font-bold text-gray-800">
                    {comp.nombre}
                  </h3>
                  <p className="text-gray-500 mt-1">{comp.descripcion}</p>
                </div>

                <div className="p-5 space-y-4">
                  {comp.indicadores.map((ind) => (
                    <div
                      key={ind.idIndicador}
                      className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <p className="font-semibold text-gray-800 mb-4">
                        {ind.indicador}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Autoevaluación del empleado */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow duration-200">
                          <p className="text-sm text-gray-500 mb-2 flex items-center justify-center gap-1">
                            <FaUser className="text-blue-500" />
                            Autoevaluación del Empleado
                          </p>
                          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                            {ind.nota}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Puntuación del empleado
                          </p>
                        </div>

                        {/* Evaluación del jefe */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                          <p className="text-sm text-gray-500 text-center mb-3 flex items-center justify-center gap-1">
                            <FaUserTie className="text-red-500" />
                            Evaluación del Jefe
                          </p>
                          <Rating
                            value={ratings[ind.idIndicador] ?? 0}
                            onChange={(value) => setRating(ind.idIndicador, value)}
                          />
                          {ratings[ind.idIndicador] && (
                            <div className="mt-3 text-center">
                              <span className={`
                                inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full
                                ${Math.abs(ratings[ind.idIndicador] - ind.nota) <= 1 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'}
                              `}>
                                <FaChartLine className="text-xs" />
                                Diferencia: {ratings[ind.idIndicador] - ind.nota}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Compromisos mejorado */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Compromisos de Mejora
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Define compromisos para el desarrollo y mejora continua
              </p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {compromisosLimpios.length} compromisos
            </span>
          </div>

          <div className="space-y-3">
            {compromisos.map((compromiso, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <textarea
                    value={compromiso}
                    onChange={(e) => actualizarCompromiso(index, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder={`Compromiso ${index + 1}`}
                    rows={2}
                  />
                </div>
                {compromisos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarCompromiso(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarCompromiso}
            className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <FaPlus className="text-sm" />
            Agregar compromiso
          </button>
        </div>

        {/* Footer sticky mejorado */}
        <div className="sticky bottom-4 bg-white rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 mt-8">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <FaCheckCircle
                className={`${
                  evaluados === totalIndicadores ? "text-green-500" : "text-gray-300"
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
                ? "Listo para guardar"
                : `Faltan ${totalIndicadores - evaluados}`}
            </span>
            {compromisosLimpios.length > 0 && (
              <>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span className="flex items-center gap-1 text-gray-600">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  {compromisosLimpios.length} compromisos
                </span>
              </>
            )}
          </div>
          <button
            onClick={guardarEvaluacion}
            disabled={saving || evaluados !== totalIndicadores}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold
              transition-all duration-300 min-w-[180px] justify-center
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
      </div>
    </div>
  );
}