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
    <div className="space-y-6">
        {data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">
                    No hay evaluaciones disponibles
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    Cuando existan evaluaciones pendientes aparecerán aquí.
                </p>
            </div>
        ) : (
            data.map((evaluation) => {
                const pendiente = evaluation.socializado === null;

                return (
                    <div
                        key={evaluation.idEvaluacion}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex flex-col gap-4 border-b bg-gray-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Evaluación #{evaluation.idEvaluacion}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Fecha: {evaluation.fechaEvaluacion}
                                </p>
                            </div>

                            <span
                                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                                    pendiente
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                <span
                                    className={`mr-2 h-2 w-2 rounded-full ${
                                        pendiente
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                    }`}
                                />
                                {pendiente
                                    ? "Pendiente de socializar"
                                    : "Socializada"}
                            </span>
                        </div>

                        {/* Información */}
                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Empleado
                                </h3>

                                <p className="text-lg font-semibold text-gray-800">
                                    {evaluation.nombreEmpleado}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    Documento:{" "}
                                    <span className="font-medium">
                                        {evaluation.documentoEmpleado}
                                    </span>
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Jefe
                                </h3>

                                <p className="text-lg font-semibold text-gray-800">
                                    {evaluation.nombreJefe}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    Documento:{" "}
                                    <span className="font-medium">
                                        {evaluation.documentoJefe}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-4 border-t bg-gray-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Socializado por
                                </p>

                                {evaluation.SocializadoPor ? (
                                    <p className="font-semibold text-gray-800">
                                        {evaluation.SocializadoPor}
                                    </p>
                                ) : (
                                    <p className="font-semibold text-red-600">
                                        Aún no socializada
                                    </p>
                                )}
                            </div>

                            <Link
                                href={`/evaluaciones/dashboard/SocializarList/SocializarEmpleado/${evaluation.idEvaluacion}`}
                                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white transition-all ${
                                    pendiente
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {pendiente
                                    ? "Socializar evaluación"
                                    : "Ver socialización"}
                            </Link>
                        </div>
                    </div>
                );
            })
        )}
    </div>
);
}
