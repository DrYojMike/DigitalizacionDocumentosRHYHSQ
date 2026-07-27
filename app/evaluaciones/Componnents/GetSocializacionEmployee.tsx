"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import { ApiResponse } from "@/app/services/api/types";
import { sileo } from "sileo";

interface CompromisoSocializacion {
    idCompromiso: number;
    descripcion: string;
}

interface Socializacion {
    idSocializacion: number;
    socializador: string;
    compromisos: CompromisoSocializacion[];
}

interface EvaluationSocializacionDetail {
    idEvaluacion: number;
    fechaEvaluacion: string;
    idEmpleado: string;
    nomEmpleado: string;
    docEmpleado: string;
    nomJefe: string;
    docJefe: string;

    compromiso: number;
    conocimiento: number;
    organizacion: number;
    normas: number;
    liderazgo: number;
    comunicacion: number;
    respeto: number;
    innovacion: number;
    hseq: number;
    gestionHumana: number;

    socializacion: Socializacion | null;
}

interface Props {
    idEvaluacion: number;
}

export default function EvaluationSocializacionDetail({idEvaluacion}: Props) {
    const [evaluation, setEvaluation] = useState<EvaluationSocializacionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [compromisos, setCompromisos] = useState<string[]>([""]);
    const getEvaluation = async () => {
        try {
            setLoading(true);

            const response =
                await httpClient.get<ApiResponse<EvaluationSocializacionDetail>>(
                    `evaluacion/socializar/evaluation/${idEvaluacion}/`
                );

            setEvaluation(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!idEvaluacion) return;
        getEvaluation();
    }, [idEvaluacion]);

    const addCompromiso = () => {
        setCompromisos([...compromisos, ""]);
    };

    const removeCompromiso = (index: number) => {
        setCompromisos(compromisos.filter((_, i) => i !== index));
    };

    const updateCompromiso = (index: number, value: string) => {
        const copia = [...compromisos];
        copia[index] = value;
        setCompromisos(copia);
    };

    const socializar = async () => {
    try {

        setLoading(true);

        const body = {
            idEvaluacion: idEvaluacion,
            IdSocializador: "739365",
            compromisos: compromisos.filter(c => c.trim() !== "")
        };

        await httpClient.post<ApiResponse<any>>(
            "evaluacion/socializar/evaluation/",
            body
        );

        // sileo.success("La evaluación fue socializada correctamente.");

        getEvaluation();

    } catch (error) {

        console.error(error);

        // sileo.error("No fue posible socializar la evaluación.");

    } finally {

        setLoading(false);

    }
};
    if (loading) {
        return (
            <div className="py-20 text-center text-gray-500">
                Cargando evaluación...
            </div>
        );
    }

    if (!evaluation) {
        return (
            <div className="py-20 text-center text-red-500">
                No fue posible cargar la evaluación.
            </div>
        );
    }

    const indicadores = [
        {
            nombre: "Compromiso",
            valor: evaluation.compromiso,
        },
        {
            nombre: "Conocimiento",
            valor: evaluation.conocimiento,
        },
        {
            nombre: "Organización",
            valor: evaluation.organizacion,
        },
        {
            nombre: "Normas",
            valor: evaluation.normas,
        },
        {
            nombre: "Liderazgo",
            valor: evaluation.liderazgo,
        },
        {
            nombre: "Comunicación",
            valor: evaluation.comunicacion,
        },
        {
            nombre: "Respeto",
            valor: evaluation.respeto,
        },
        {
            nombre: "Innovación",
            valor: evaluation.innovacion,
        },
        {
            nombre: "HSEQ",
            valor: evaluation.hseq,
        },
        {
            nombre: "Gestión Humana",
            valor: evaluation.gestionHumana,
        },
    ];

    const getColor = (valor: number) => {
        if (valor >= 90)
            return "bg-green-100 text-green-700 border-green-300";

        if (valor >= 70)
            return "bg-yellow-100 text-yellow-700 border-yellow-300";

        return "bg-red-100 text-red-700 border-red-300";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl shadow-md border p-6">

                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-3xl font-bold">
                            Evaluación #{evaluation.idEvaluacion}
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {evaluation.fechaEvaluacion}
                        </p>

                    </div>

                    <span className="rounded-full bg-green-100 text-green-700 px-4 py-2 font-semibold">

                        Socializada

                    </span>

                </div>

            </div>

            {/* Información */}

            <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-white rounded-xl border shadow-sm p-6">

                    <h2 className="font-bold text-lg mb-4">

                        Empleado

                    </h2>

                    <p className="text-xl font-semibold">

                        {evaluation.nomEmpleado}

                    </p>

                    <p className="text-gray-500">

                        Documento: {evaluation.docEmpleado}

                    </p>

                </div>

                <div className="bg-white rounded-xl border shadow-sm p-6">

                    <h2 className="font-bold text-lg mb-4">

                        Jefe Evaluador

                    </h2>

                    <p className="text-xl font-semibold">

                        {evaluation.nomJefe}

                    </p>

                    <p className="text-gray-500">

                        Documento: {evaluation.docJefe}

                    </p>

                </div>

            </div>

            {/* Competencias */}

            <div>

                <h2 className="text-2xl font-bold mb-4">

                    Competencias

                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

                    {indicadores.map((item) => (

                        <div
                            key={item.nombre}
                            className={`rounded-xl border p-5 ${getColor(
                                item.valor
                            )}`}
                        >
                            <p className="text-sm">

                                {item.nombre}

                            </p>

                            <h3 className="text-3xl font-bold mt-2">

                                {item.valor.toFixed(1)}%

                            </h3>

                        </div>

                    ))}

                </div>

            </div>

            {/* Socialización */}
            {evaluation.socializacion == null && (

                <div className="bg-white rounded-xl shadow border p-6 mt-6">

                    <h2 className="text-xl font-bold mb-5">

                        Registrar socialización

                    </h2>

                    <div className="space-y-3">

                        {compromisos.map((item,index)=>(

                            <div
                                key={index}
                                className="flex gap-3"
                            >

                                <input
                                    type="text"
                                    value={item}
                                    placeholder={`Compromiso ${index+1}`}
                                    onChange={(e)=>updateCompromiso(index,e.target.value)}
                                    className="flex-1 rounded-lg border px-3 py-2"
                                />

                                <button
                                    type="button"
                                    onClick={()=>removeCompromiso(index)}
                                    className="rounded-lg bg-red-500 text-white px-4"
                                >

                                    Eliminar

                                </button>

                            </div>

                        ))}

                    </div>

                    <div className="flex justify-between mt-6">

                        <button

                            type="button"

                            onClick={addCompromiso}

                            className="rounded-lg bg-blue-600 text-white px-5 py-2"

                        >

                            Agregar compromiso

                        </button>

                        <button

                            type="button"

                            disabled={loading}

                            onClick={socializar}

                            className="rounded-lg bg-green-600 text-white px-6 py-2"

                        >

                            {loading ? "Guardando..." : "Socializar evaluación"}

                        </button>

                    </div>

                </div>

                )}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <h2 className="text-2xl font-bold mb-5">

                    Socialización

                </h2>

                {evaluation.socializacion ? (
                    <>
                        <div className="mb-6">

                            <p className="text-gray-500 text-sm">

                                Socializador

                            </p>

                            <p className="text-lg font-semibold">

                                {evaluation.socializacion.socializador}

                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold mb-3">

                                Compromisos

                            </h3>

                            {evaluation.socializacion.compromisos.length ===
                            0 ? (
                                <p className="text-gray-500">

                                    No existen compromisos.

                                </p>
                            ) : (
                                <div className="space-y-3">

                                    {evaluation.socializacion.compromisos.map(
                                        (item) => (
                                            <div
                                                key={item.idCompromiso}
                                                className="rounded-lg border bg-gray-50 p-4"
                                            >
                                                <p>

                                                    {item.descripcion}

                                                </p>
                                            </div>
                                        )
                                    )}

                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">

                        <h3 className="text-xl font-semibold text-red-600">

                            La evaluación aún no ha sido socializada.

                        </h3>

                    </div>
                )}

            </div>

        </div>
    );
}