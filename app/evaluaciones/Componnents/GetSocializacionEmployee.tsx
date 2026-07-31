"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import { ApiResponse } from "@/app/services/api/types";
import { sileo } from "sileo";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";
interface CompromisoSocializacion {
    idCompromiso: number;
    descripcion: string;
}

interface compromisosJefes{ 
    idCompromiso: number
    descripcion: string
}

interface Socializacion {
    idSocializacion: number;
    socializador: string;
    compromisos: CompromisoSocializacion[];
    compromisosJefes: compromisosJefes[];
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
    <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}

        <div className="rounded-2xl border bg-white p-6 shadow-md">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Evaluación #{evaluation.idEvaluacion}
                    </h1>

                    <p className="mt-1 text-gray-500">
                        {evaluation.fechaEvaluacion}
                    </p>

                </div>

                <span
                    className={`rounded-full px-5 py-2 font-semibold ${
                        evaluation.socializacion
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {evaluation.socializacion
                        ? "Socializada"
                        : "Pendiente de socialización"}
                </span>

            </div>

        </div>

        {/* Empleado */}

        <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h2 className="mb-3 text-lg font-bold">
                    Empleado
                </h2>

                <p className="text-xl font-semibold">
                    {evaluation.nomEmpleado}
                </p>

                <p className="text-gray-500">
                    Documento: {evaluation.docEmpleado}
                </p>

            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h2 className="mb-3 text-lg font-bold">
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

        {/* Resultados */}

        <div className="overflow-hidden rounded-2xl border bg-white shadow-md">

            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-5">

                <h2 className="text-2xl font-bold">
                    Resultados de la evaluación
                </h2>

                <div className="rounded-xl bg-yellow-300 px-6 py-3 text-center">

                    <p className="text-sm font-medium">
                        Calificación General
                    </p>

                    <p className="text-3xl font-bold">
                        {(
                            indicadores.reduce(
                                (acc, item) => acc + item.valor,
                                0
                            ) / indicadores.length
                        ).toFixed(1)}
                        %
                    </p>

                </div>

            </div>

            <div className="grid lg:grid-cols-2">

                {/* Tabla */}

                <div className="border-r p-6">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b bg-gray-100">

                                <th className="py-3 text-left">
                                    Centro de evaluación
                                </th>

                                <th className="py-3 text-right">
                                    %
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {indicadores.map((item) => (

                                <tr
                                    key={item.nombre}
                                    className="border-b transition hover:bg-gray-50"
                                >

                                    <td className="py-3">
                                        {item.nombre}
                                    </td>

                                    <td
                                        className={`py-3 text-right font-bold ${
                                            item.valor >= 90
                                                ? "text-green-600"
                                                : item.valor >= 70
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {item.valor.toFixed(0)}%
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* Grafica */}

                <div className="h-[450px] p-6">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={indicadores}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="nombre"
                                angle={-25}
                                textAnchor="end"
                                interval={0}
                            />

                            <YAxis
                                domain={[0, 100]}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="valor"
                                radius={[6, 6, 0, 0]}
                            >

                                {indicadores.map(
                                    (item, index) => (

                                        <Cell
                                            key={index}
                                            fill={
                                                item.valor >= 90
                                                    ? "#22c55e"
                                                    : item.valor >= 70
                                                    ? "#facc15"
                                                    : "#ef4444"
                                            }
                                        />

                                    )
                                )}

                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

        {/* Registrar Socialización */}

        {!evaluation.socializacion && (

            <div className="rounded-2xl border bg-white p-6 shadow-md">

                <h2 className="mb-5 text-2xl font-bold">
                    Registrar Socialización
                </h2>

                <div className="space-y-3">

                    {compromisos.map((item, index) => (

                        <div
                            key={index}
                            className="flex gap-3"
                        >

                            <input
                                value={item}
                                onChange={(e) =>
                                    updateCompromiso(
                                        index,
                                        e.target.value
                                    )
                                }
                                placeholder={`Compromiso ${
                                    index + 1
                                }`}
                                className="flex-1 rounded-lg border px-4 py-2"
                            />

                            <button
                                onClick={() =>
                                    removeCompromiso(index)
                                }
                                className="rounded-lg bg-red-500 px-4 text-white hover:bg-red-600"
                            >
                                Eliminar
                            </button>

                        </div>

                    ))}

                </div>

                <div className="mt-6 flex justify-between">

                    <button
                        onClick={addCompromiso}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Agregar compromiso
                    </button>

                    <button
                        disabled={loading}
                        onClick={socializar}
                        className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                    >
                        {loading
                            ? "Guardando..."
                            : "Socializar evaluación"}
                    </button>

                </div>

            </div>

        )}

        {/* Socialización */}

        <div className="rounded-2xl border bg-white p-6 shadow-md">

            <h2 className="mb-6 text-2xl font-bold">
                Socialización
            </h2>

            {evaluation.socializacion ? (

                <>

                    <div className="mb-6">

                        <p className="text-sm text-gray-500">
                            Socializador
                        </p>

                        <p className="text-lg font-semibold">
                            {evaluation.socializacion.socializador}
                        </p>

                    </div>

                    <div>

                        <h3 className="mb-3 text-lg font-semibold">
                            Compromisos
                        </h3>

                        {evaluation.socializacion.compromisos
                            .length === 0 ? (

                            <p className="text-gray-500">
                                No existen compromisos.
                            </p>

                        ) : (

                            <div className="space-y-3">

                                {evaluation.socializacion.compromisos.map(
                                    (item) => (

                                        <div
                                            key={
                                                item.idCompromiso
                                            }
                                            className="rounded-lg border bg-gray-50 p-4"
                                        >

                                            {item.descripcion}

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </>

            ) : (

                <div className="py-10 text-center">

                    <h3 className="text-xl font-semibold text-red-600">

                        La evaluación aún no ha sido socializada.

                    </h3>

                </div>

            )}

        </div>

    </div>
);
}