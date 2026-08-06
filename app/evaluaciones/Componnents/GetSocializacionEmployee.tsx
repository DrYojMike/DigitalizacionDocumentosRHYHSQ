"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { httpClient } from "@/app/services/api/client";
import { ApiResponse } from "@/app/services/api/types";
import EvaluationIndicators from "@/app/evaluaciones/Componnents/IndicadoresEvaluationSocializacion/Indicador";
import EvaluationCommitments from "@/app/evaluaciones/Componnents/IndicadoresEvaluationSocializacion/Compromisoso";
import SocializationForm from "@/app/evaluaciones/Componnents/IndicadoresEvaluationSocializacion/SocializacionForm";

interface CompromisoSocializacion {
    idCompromiso: number;
    descripcion: string;
}

interface Indicadores {
    nombre: string;
    nota: number;
}

interface CompromisosJefes {
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
    FechaSocializacion: string;
    idEmpleado: string;
    nomEmpleado: string;
    docEmpleado: string;
    cargo: string;
    nomJefe: string;
    docJefe: string;
    cargoJefe: string;
    idJefe: string;
    Indicadores: Indicadores[];
    socializacion: Socializacion | null;
    compromisosJefes: CompromisosJefes[];
}

interface Props {
    idEvaluacion: number;
}

export default function EvaluationSocializacionDetail({
    idEvaluacion,
}: Props) {

    const { user } = useAuth();

    const [evaluation, setEvaluation] =
        useState<EvaluationSocializacionDetail | null>(null);

    const [loading, setLoading] = useState(true);

    const getEvaluation = async () => {

        try {

            setLoading(true);

            const response =
                await httpClient.get<ApiResponse<EvaluationSocializacionDetail>>(
                    `evaluacion/socializar/evaluation/${idEvaluacion}/`
                );

            console.log("Datos recibidos:", response.data.data); // Depuración
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

    const socializar = async (compromisos: string[]) => {
        try {
            setLoading(true);
            await httpClient.post("evaluacion/socializar/evaluation/",
                {
                    idEvaluacion,
                    IdSocializador: evaluation?.idJefe || '739365',
                    compromisos,
                }
            );
            getEvaluation();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calcular fecha de próxima evaluación (3 meses después de la socialización)
    const getProximaEvaluacion = (fechaSocializacion: string) => {
        const fecha = new Date(fechaSocializacion);
        fecha.setMonth(fecha.getMonth() + 3);
        return fecha;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando evaluación...</p>
                </div>
            </div>
        );
    }

    if (!evaluation) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-600">Error al cargar</h3>
                    <p className="text-gray-500">No fue posible cargar la evaluación.</p>
                </div>
            </div>
        );
    }

    // Depuración: Verificar estado de socialización
    console.log("¿Está socializada?", evaluation.socializacion);
    console.log("Valor de socializacion:", evaluation.socializacion);

    const isSocialized = evaluation.socializacion !== null && 
                        evaluation.socializacion !== undefined && 
                        evaluation.socializacion.idSocializacion > 0;

    return (  
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-400 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-indigo-50 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
                <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Evaluación #{evaluation.idEvaluacion}
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(evaluation.fechaEvaluacion).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm ${
                            isSocialized
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                isSocialized ? "bg-emerald-500" : "bg-amber-500"
                            }`}></span>
                            {isSocialized
                                ? "Socializada"
                                : "Pendiente de socialización"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Información */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Empleado */}
                <div className="group rounded-xl border border-gray-400 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Empleado
                        </h2>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                        {evaluation.nomEmpleado}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p className="flex items-center gap-2">
                            <span className="w-20 text-gray-400">Documento:</span>
                            <span className="font-medium text-gray-700">{evaluation.docEmpleado}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="w-20 text-gray-400">Cargo:</span>
                            <span className="font-medium text-gray-700">{evaluation.cargo}</span>
                        </p>
                    </div>
                </div>

                {/* Jefe Evaluador */}
                <div className="group rounded-xl border border-gray-400 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Jefe Evaluador
                        </h2>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                        {evaluation.nomJefe}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <span className="text-gray-400">Documento:</span>
                        <span className="font-medium text-gray-700">{evaluation.docJefe}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-20 text-gray-400">Cargo:</span>
                        <span className="font-medium text-gray-700">{evaluation.cargoJefe}</span>
                    </p>
                </div>
            </div>

            {/* Indicadores */}
            <EvaluationIndicators
                indicadores={evaluation.Indicadores}
            />

            {/* Compromisos */}
            <EvaluationCommitments
                socializacion={evaluation.socializacion}
                compromisosJefes={evaluation.compromisosJefes}
            />

            {/* Formulario - Siempre visible si NO está socializada */}
            {!isSocialized && (
                <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-8">
                    <SocializationForm
                        loading={loading}
                        onSubmit={socializar}
                    />
                </div>
            )}

            {/* Mensaje de próxima evaluación - Solo si está socializada */}
            {isSocialized && evaluation.FechaSocializacion && (
                <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
                    <div className="relative flex items-start gap-4 p-6">
                        <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl">
                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Seguimiento de Evaluacion
                            </h3>
                            <p className="mt-1 text-gray-700">
                                Se Realizara Seguimiento de Los Compromisos{' '}
                                <strong className="text-blue-700">
                                    {getProximaEvaluacion(evaluation.FechaSocializacion).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </strong>
                                , completando así 3 meses desde la socialización.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                <span className="inline-flex items-center gap-1.5 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Socialización: {new Date(evaluation.FechaSocializacion).toLocaleDateString('es-ES')}
                                </span>
                                <span className="text-gray-300 hidden sm:inline">|</span>
                                <span className="inline-flex items-center gap-1.5 text-blue-600 font-medium">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    +3 meses
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FIRMAS - Solo visible si está socializada */}
            {isSocialized && (
                <div className="rounded-2xl border border-gray-400 bg-white shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                        <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h.01M9 15h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Firmas de Conformidad
                        </h3>
                        <p className="text-sm  mt-1">
                            Las siguientes firmas certifican que ambas partes han revisado y acordado los compromisos establecidos
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Firma Gestión Humana */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold">
                                        Gestión Humana
                                    </h4>
                                    <p className="text-sm ">
                                        Representante de RH
                                    </p>
                                    <p className="text-xs ">
                                        Documento:
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs">Fecha</p>
                                    <p className="text-sm font-medium ">
                                        {new Date(evaluation.FechaSocializacion).toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t-2 border-dashed border-gray-300 pt-2">
                                <div className="h-10 flex items-center text-gray-300 justify-center">
                                    <svg className="w-32 h-8 " viewBox="0 0 200 40">
                                        <path d="M10,30 Q50,5 90,25 Q130,45 170,10 Q190,0 195,5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                        <path d="M20,35 Q60,10 100,30 Q140,50 180,15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
                                    </svg>
                                </div>
                                <p className="text-center text-xs">
                                    Firma Gestión Humana
                                </p>
                            </div>
                        </div>

                        {/* Firma Jefe */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold ">
                                        Jefe Inmediato
                                    </h4>
                                    <p className="text-sm ">
                                        {evaluation.nomJefe}
                                    </p>
                                    <p className="text-xs ">
                                        Documento: {evaluation.docJefe}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs ">Fecha</p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {new Date(evaluation.FechaSocializacion).toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t-2 border-dashed border-gray-300 pt-2">
                                <div className="h-10 flex items-center justify-center">
                                    <svg className="w-32 h-8 text-gray-300" viewBox="0 0 200 40">
                                        <path d="M10,30 Q50,5 90,25 Q130,45 170,10 Q190,0 195,5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                        <path d="M20,35 Q60,10 100,30 Q140,50 180,15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
                                    </svg>
                                </div>
                                <p className="text-center text-xs ">
                                    Firma del Jefe
                                </p>
                            </div>
                        </div>

                        {/* Firma Empleado */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold">
                                        Empleado
                                    </h4>
                                    <p className="text-sm ">
                                        {evaluation.nomEmpleado}
                                    </p>
                                    <p className="text-xs ">
                                        Documento: {evaluation.docEmpleado}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs ">Fecha</p>
                                    <p className="text-sm font-medium ">
                                        {new Date(evaluation.FechaSocializacion).toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t-2 border-dashed border-gray-300 pt-2">
                                <div className="h-10 flex items-center justify-center">
                                    <svg className="w-32 h-8 text-gray-300" viewBox="0 0 200 40">
                                        <path d="M10,30 Q50,5 90,25 Q130,45 170,10 Q190,0 195,5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                        <path d="M20,35 Q60,10 100,30 Q140,50 180,15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
                                    </svg>
                                </div>
                                <p className="text-center text-xs ">
                                    Firma del Empleado
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pie de página de firmas */}
                    <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-3">
                        <p className="text-xs text-gray-400 text-center">
                            Al firmar, las tres partes confirman que han leído y aceptado los compromisos establecidos en esta socialización.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}