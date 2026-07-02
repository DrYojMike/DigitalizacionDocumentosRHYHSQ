"use client"
import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import {
  FaUser,
  FaUserTie,
  FaCheckCircle,
  FaChartBar,
} from "react-icons/fa";

interface Props {
  idevageneral: number;
}

interface Indicador {
  idIndicador: number;
  indicador: string;
  nota: number;
  notaJefe: number;
}

interface Competencia {
  idCompetencia: number;
  nombre: string;
  descripcion: string;
  indicadores: Indicador[];
}

interface Area {
  idArea: number;
  area: string;
  competencias: Competencia[];
}

interface Compromiso {
  idCompromiso: number;
  compromiso: string;
}

interface EvaluacionCompleta {
  usuario: string;
  jefe: string;
  fecha: string;
  areas: Area[];
  compromisos: Compromiso[];
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export default function MyEvaluation({ idevageneral }: Props) {

  const [data, setData] = useState<EvaluacionCompleta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvaluation();
  }, [idevageneral]);

  const getEvaluation = async () => {
    try {
      const response = await httpClient.get<ApiResponse<EvaluacionCompleta>>(
        `evaluacion/evaluacion/${idevageneral}/`
      );

      setData(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Cargando...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        No existe información.
      </div>
    );
  }

  const getNotaStyle = (nota: number) => {
    if (nota <= 1) {
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Debe mejorar",
      };
    }

    if (nota <= 2) {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Mejorable",
      };
    }

    return {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Buena",
    };
  };
  
return (
  <div className="max-w-6xl mx-auto p-6">

    <div className="bg-white rounded-xl shadow p-6 mb-8">

      <h1 className="text-3xl font-bold mb-4">
        Resultado Evaluación
      </h1>

      <div className="grid md:grid-cols-3 gap-4">

        <div>
          <p className="text-gray-500">Empleado</p>

          <p className="font-semibold flex items-center gap-2">
            <FaUser />
            {data.usuario}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Jefe</p>

          <p className="font-semibold flex items-center gap-2">
            <FaUserTie />
            {data.jefe}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Fecha</p>
          <p className="font-semibold">{data.fecha}</p>
        </div>

      </div>

    </div>

    {data.areas.map((area) => (

      <div key={area.idArea} className="mb-10">

        <h2 className="text-2xl font-bold mb-5">
          {area.area}
        </h2>

        {area.competencias.map((competencia) => (

          <div
            key={competencia.idCompetencia}
            className="bg-white rounded-xl shadow mb-6"
          >

            <div className="border-b p-5">

              <h3 className="font-bold text-xl">
                {competencia.nombre}
              </h3>

              <p className="text-gray-500 mt-1">
                {competencia.descripcion}
              </p>

            </div>

            <div className="p-5 space-y-4">

              {competencia.indicadores.map((indicador) => {

                const promedio = (indicador.nota + indicador.notaJefe) / 2;
                const promedioStyle = getNotaStyle(promedio);

                return (
                  <div
                    key={indicador.idIndicador}
                    className="border rounded-xl p-5"
                  >

                    <p className="font-medium mb-4">
                      {indicador.indicador}
                    </p>

                    <div className="grid md:grid-cols-3 gap-5">

                      <div className="bg-blue-50 rounded-xl p-5 text-center">

                        <p className="text-gray-600 mb-2">
                          Empleado
                        </p>

                        <div className="text-4xl font-bold text-blue-700">
                          {indicador.nota.toFixed(1)}
                        </div>

                      </div>

                      <div className="bg-red-50 rounded-xl p-5 text-center">

                        <p className="text-gray-600 mb-2">
                          Jefe
                        </p>

                        <div className="text-4xl font-bold text-red-700">
                          {indicador.notaJefe.toFixed(1)}
                        </div>

                      </div>

                      <div className={`${promedioStyle.bg} rounded-xl p-5 text-center`}>

                        <p className="text-gray-600 mb-2">
                          Promedio
                        </p>

                        <div className={`text-4xl font-bold ${promedioStyle.text}`}>
                          {promedio.toFixed(1)}
                        </div>

                        <span
                          className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${promedioStyle.bg} ${promedioStyle.text}`}
                        >
                          {promedioStyle.label}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        ))}

      </div>

    ))}

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
        <FaCheckCircle />
        Compromisos
      </h2>

      <div className="space-y-3">

        {data.compromisos.map((compromiso) => (

          <div
            key={compromiso.idCompromiso}
            className="border-l-4 border-red-600 bg-gray-50 p-4 rounded"
          >
            {compromiso.compromiso}
          </div>

        ))}

      </div>

    </div>

  </div>
);
}