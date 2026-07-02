"use client";

import { useAuth } from "@/app/context/AuthContext";
import ModuleCard from "@/app/components/home/ModuleCard";
import {
  FaClipboardCheck,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

export default function EvaluacionHome() {
  const { user, loading } = useAuth();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaLimite = new Date("2026-07-15");
  fechaLimite.setHours(0, 0, 0, 0);

  const puedeEvaluar =
    user?.permissions?.evaluacion && hoy <= fechaLimite;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Cargando...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Evaluaciones de desempeño
        </h1>

        <p className="mt-2 text-gray-600">
          Gestiona tus autoevaluaciones y las evaluaciones de tu equipo.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {user && (
          <>
            {puedeEvaluar ? (
              <ModuleCard
                icon={<FaClipboardCheck />}
                title="Realizar autoevaluación"
                description="Completa tu evaluación de desempeño antes de la fecha límite."
                href={`/evaluaciones/tipo/${user.permissions.tipoEvaluacion}`}
              />
            ) : (
              <ModuleCard
                icon={<FaCheckCircle />}
                title="Autoevaluación finalizada"
                description="Tu evaluación fue enviada correctamente. Pronto estará disponible el resultado."
                href={`/evaluaciones/dashboard/myevaluations/${user.id}`}
              />
            )}

            {user.permissions?.empleadosCargo && (
              <ModuleCard
                icon={<FaUsers />}
                title="Evaluar colaboradores"
                description="Consulta el personal pendiente por evaluar y completa sus evaluaciones."
                href={`/evaluaciones/dashboard/listPendiente/${user.documento}`}
              />
            )}
          </>
        )}

      </div>
    </main>
  );
}