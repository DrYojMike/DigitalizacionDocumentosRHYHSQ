"use client";

import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import Link from "next/link";
import { FaUsers, FaClock, FaCheckCircle, FaBuilding,FaBriefcase,FaIdCard,FaFilter,FaArrowRight,FaExclamationCircle,FaUserCheck,FaUserClock} from "react-icons/fa";
import { EvaUsuario } from "@/app/evaluaciones/types/ListOfEmployeesAtEvaluation";
import { ApiResponse, ApiError } from "@/app/services/api/types";
import { sileo } from "sileo";

interface Props {
  documento: string;
}

export default function ListOfEmployeesAtEvaluation({ documento }: Props) {
  const [employees, setEmployees] = useState<EvaUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    getEmployees();
  }, [documento]);

  const getEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await httpClient.get<ApiResponse<EvaUsuario[]>>(
        `evaluacion/list/empleados/${documento}`
      );
      setEmployees(response.data.data);
      sileo.success({
        description: response.data.message
      })
    } catch (err) {
      const error = err as ApiError
      console.error("Error al cargar empleados:", error);
      sileo.error({
        title: `Error: ${error.status}`,
        description: error.message
      })
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = employees.filter((emp) => emp.evaluacion === null).length;
  const completedCount = employees.filter((emp) => emp.evaluacion !== null).length;

  const filteredEmployees = employees.filter((employee) => {

    // Estado
    if (filter === "pending" && employee.evaluacion !== null) return false;
    if (filter === "completed" && employee.evaluacion === null) return false;

    // Año
    if (
      selectedYear !== "all" &&
      employee.evaluacion &&
      new Date(employee.evaluacion).getFullYear().toString() !== selectedYear
    ) {
      return false;
    }

    // Búsqueda
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase().trim();

      return (
        employee.name.toLowerCase().includes(search) ||
        employee.cedula.includes(search) ||
        employee.userid.toLowerCase().includes(search) ||
        employee.departamento.toLowerCase().includes(search) ||
        employee.cargo.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const availableYears = [
    "all",
    ...new Set(
      employees
        .filter(emp => emp.evaluacion)
        .map(emp => new Date(emp.evaluacion!).getFullYear().toString())
    ),
  ].sort();

  // Loading State mejorado
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600" />
          <p className="text-gray-600 font-medium">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total empleados</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {employees.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FaUsers className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-red-700 mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <FaClock className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Realizadas</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {completedCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <FaCheckCircle className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda mejorados */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                filter === "all"
                  ? "bg-red-600 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }
            `}
          >
            <FaUsers className="text-sm" />
            Todos ({employees.length})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                filter === "pending"
                  ? "bg-red-600 text-white shadow-md scale-105"
                  : "bg-red-50 text-red-700 hover:bg-red-100 hover:scale-105"
              }
            `}
          >
            <FaClock className="text-sm" />
            Pendientes ({pendingCount})
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                filter === "completed"
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : "bg-green-50 text-green-700 hover:bg-green-100 hover:scale-105"
              }
            `}
          >
            <FaCheckCircle className="text-sm" />
            Evaluados ({completedCount})
          </button>
        </div>  

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaFilter className="text-red-600" />
            <span className="font-medium">Año:</span>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium outline-none
              focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:border-red-400 cursor-pointer">
            <option value="all">Todos los años</option>
            {availableYears
              .filter((year) => year !== "all").map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Lista de empleados */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">
            {searchTerm ? "🔍" : "📋"}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm ? "No se encontraron resultados" : "No hay empleados disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No se encontraron empleados que coincidan con "${searchTerm}"`
              : `No existen empleados para el filtro seleccionado.`
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.contador}
              className={`bg-white rounded-xl shadow-md p-5  border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                ${
                  employee.evaluacion === null
                    ? "border-red-500 hover:border-red-400"
                    : "border-green-500 hover:border-green-400"
                }
              `}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                      ${employee.evaluacion === null 
                        ? "bg-red-100 text-red-600" 
                        : "bg-green-100 text-green-600"}
                    `}>
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {employee.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {employee.evaluacion === null ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                            <FaClock className="text-xs" />
                            Pendiente de Autoevaluación
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                            <FaCheckCircle className="text-xs" />
                            Autoevaluación realizada el dia ({employee.evaluacion})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de acción mejorado */}
                <div className="flex items-center mt-3 md:mt-0">
                  {employee.evaluado === null ? (
                    <Link
                      href={`/evaluaciones/evaluar/${employee.idevageneral}`}
                      className="group flex items-center gap-2 px-6 py-2.5  bg-red-600 text-white rounded-xl font-medium
                        hover:bg-red-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <FaUserCheck className="text-sm" />
                      Evaluar
                      <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl font-medium">
                      <FaUserClock />
                      Ya evaluado
                    </span>
                  )}
                </div>
              </div>

              {/* Información del empleado mejorada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <FaIdCard className="text-gray-400 text-sm" />
                  <span>
                    <strong className="text-gray-600">Cédula:</strong>{" "}
                    <span className="text-gray-800">{employee.cedula}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <FaBuilding className="text-gray-400 text-sm" />
                  <span>
                    <strong className="text-gray-600">Departamento:</strong>{" "}
                    <span className="text-gray-800">{employee.departamento}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <FaBriefcase className="text-gray-400 text-sm" />
                  <span>
                    <strong className="text-gray-600">Cargo:</strong>{" "}
                    <span className="text-gray-800">{employee.cargo}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer con resumen */}
      {filteredEmployees.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
            <span>
              Mostrando {filteredEmployees.length} de {employees.length} empleados
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Sin AutoEvaluacion: {pendingCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Con AutoEvaluados: {completedCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}