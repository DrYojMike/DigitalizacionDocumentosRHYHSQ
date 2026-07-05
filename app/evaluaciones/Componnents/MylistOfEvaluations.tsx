"use client";

import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import ModuleCard from "@/app/components/home/ModuleCard";
import { FaClipboardCheck } from "react-icons/fa";
import { EvaluationInfo } from "@/app/evaluaciones/types/MyListOfEvaluations";
import { ApiError, ApiResponse } from "@/app/services/api/types";
import { sileo } from "sileo";
interface Props {
  idUsuario: string;
}

export default function MylistOfEvaluations({ idUsuario }: Props) {
  const [evaluaciones, setEvaluaciones] = useState<EvaluationInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvaluations();
  }, [idUsuario]);

  const getEvaluations = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<ApiResponse<EvaluationInfo[]>>(
        `evaluacion/my/evaluations/${idUsuario}/`
      );
      setEvaluaciones(response.data.data);
      sileo.success({
        description: response.data.message
      })
    } catch (err) {
      const error = err as ApiError
      console.error(error);
      sileo.error({
        title: `Error: ${error.status}`,
        description: error.message
      })
      setEvaluaciones([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Cargando evaluaciones...
      </div>
    );
  }

  if (evaluaciones.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Aun no cuentas con evaluaciones comples registradas.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Historial de Evaluaciones
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {evaluaciones.map((evaluacion, contador) => (
          <ModuleCard
            key={evaluacion.idevageneral}
            title={`Evaluación #${contador + 1}`}
            description={
              `Fecha: ${evaluacion.fecevageneral}

                Empleado: ${evaluacion.empleado}

                Jefe: ${evaluacion.jefe}`
            }
            icon={<FaClipboardCheck />}
            href={`/evaluaciones/dashboard/evaluation/${evaluacion.idevageneral}`}
          />
          
        ))}

      </div>

    </div>
  );
}