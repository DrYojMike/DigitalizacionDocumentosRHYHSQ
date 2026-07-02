import ModuleCard from "@/app/components/home/ModuleCard";
import {
  FaClipboardCheck,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

interface EmployeeViewProps {
  evaluacion: boolean;
  tipoEvaluacion: number;
  empleadoAcargo: boolean;
  documento: string | null;
}

export default function EmployeeView({
  evaluacion,
  tipoEvaluacion,
  empleadoAcargo,
  documento,
}: EmployeeViewProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <ModuleCard
          icon={<FaClipboardCheck />}
          title="Evaluaciones"
          description="Realiza o consulta tus evaluaciones de desempeño."
          href="/evaluaciones/dashboard"
        />
        {/* {documento && (
            <ModuleCard
            icon={<FaFileAlt />}
            title="Documentos"
            description="Consulta los documentos disponibles para ti."
            href="/documentos"
            />
        )} */}

      {empleadoAcargo && (
        <ModuleCard
          icon={<FaUsers />}
          title="Equipo a cargo"
          description="Gestiona la información de tu equipo de trabajo."
          href="/empleados"
        />
      )}

    </div>
  );
}