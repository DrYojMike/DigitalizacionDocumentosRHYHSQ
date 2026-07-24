import ModuleCard from "@/app/components/home/ModuleCard";
import {
  FaClipboardCheck
} from "react-icons/fa";

export default function AdminView() {

    return (

        <div className="grid md:grid-cols-3 gap-6">
            <ModuleCard
                icon={<FaClipboardCheck />}
                title="Ver Estadisticas De Evaluacion de Desempeño."
                description="Visualiza de manera grafica los reportes anuales de las evaluaciones de desempeño."
                href={`/evaluaciones/dashboard/indicadores/`}
            />

            <ModuleCard
                icon={<FaClipboardCheck />}
                title="Socializar Evaluacion de Desempeño"
                description="Socializa la evaluacion a tus colaboradores de manera rapida y sencilla."
                href={`/evaluaciones/dashboard/SocializarList/`}
            />
        </div>

    )

}