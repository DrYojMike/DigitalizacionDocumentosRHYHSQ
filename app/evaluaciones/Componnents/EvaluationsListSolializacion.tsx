import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { ApiResponse, ApiError} from "@/app/services/api/types";
import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import { sileo } from "sileo";
interface EvaluationsSocializacion{
    idEvaluacion: number,
    fechaEvaluacion:string,
    idEmpleado: string,
    nombreEmpleado:string,
    documentoEmpleado:string,
    nombreJefe:string,
    documentoJefe: string,
    socializado: number | null,
    SocializadoPor: string | null
}

interface props{
    docuemntoEmpleado: string
}
export default function SocializacionEvaluationListEmploye({ docuemntoEmpleado }: props) {
    const { user } = useAuth();
    const [data, setData] = useState<EvaluationsSocializacion[]>([]);

    const getEvaluations = async () => {
        try {
            const response = await httpClient.get<ApiResponse<EvaluationsSocializacion[]>>(
                `evaluacion/list/empleado/evaluation/${docuemntoEmpleado}/`
            );

            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };

    useEffect(() => {
        if (!docuemntoEmpleado) return;
        getEvaluations();
    }, [docuemntoEmpleado]);

    return (
    <div className="space-y-4">
        {data.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                No hay evaluaciones disponibles.
            </div>
        ) : (
            data.map((evaluation) => (
                <div
                    key={evaluation.idEvaluacion}
                    className={`rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md ${
                        evaluation.socializado === null
                            ? "border-red-500"
                            : "border-green-500"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Evaluación #{evaluation.idEvaluacion}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {evaluation.fechaEvaluacion}
                            </p>
                        </div>

                        <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                evaluation.socializado === null
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                        >
                            {evaluation.socializado === null
                                ? "Pendiente de socializar"
                                : "Socializada"}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-500">Empleado</p>
                            <p className="font-medium">
                                {evaluation.nombreEmpleado}
                            </p>
                            <p className="text-sm text-gray-600">
                                CC: {evaluation.documentoEmpleado}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Jefe</p>
                            <p className="font-medium">
                                {evaluation.nombreJefe}
                            </p>
                            <p className="text-sm text-gray-600">
                                CC: {evaluation.documentoJefe}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 border-t pt-3">
                        <p className="text-sm">
                            <span className="font-semibold">
                                Socializado por:
                            </span>{" "}
                            {evaluation.SocializadoPor ?? (
                                <span className="text-red-600">
                                    Aún no socializada
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            ))
        )}
    </div>
);

}
