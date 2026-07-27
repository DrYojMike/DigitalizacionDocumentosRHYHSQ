"use client";

import { useState } from "react";
import SocializacionEvaluationListEmploye from "@/app/evaluaciones/Componnents/EvaluationsListSolializacion";

export default function Page() {
    const [documento, setDocumento] = useState("");
    const [buscarDocumento, setBuscarDocumento] = useState("");

    const handleBuscar = () => {
        const doc = documento.trim();

        if (!doc) return;

        setBuscarDocumento(doc);
    };

    return (
    <div className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                    <h1 className="text-3xl font-bold">
                        Buscar Evaluaciones
                    </h1>
                    <p className="mt-2 text-blue-100">
                        Consulta las evaluaciones pendientes de socialización de
                        un colaborador ingresando su número de documento.
                    </p>
                </div>

                {/* Formulario */}
                <div className="space-y-6 p-8">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Documento del empleado
                        </label>

                        <div className="flex flex-col gap-3 md:flex-row">
                            <input
                                type="text"
                                placeholder="Ej: 123456789"
                                value={documento}
                                onChange={(e) =>
                                    setDocumento(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleBuscar();
                                    }
                                }}
                                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                            />

                            <button
                                onClick={handleBuscar}
                                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {buscarDocumento && (
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                    <SocializacionEvaluationListEmploye
                        key={buscarDocumento}
                        docuemntoEmpleado={buscarDocumento}
                    />
                </div>
            )}
        </div>
    </div>
);
}
