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
        <div className="mx-auto max-w-4xl p-6">
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h1 className="mb-2 text-2xl font-bold">
                    Buscar Evaluaciones
                </h1>

                <p className="mb-6 text-gray-600">
                    Digita el documento del empleado para consultar sus
                    evaluaciones pendientes de socialización.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Documento del empleado"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleBuscar();
                            }
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                        onClick={handleBuscar}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {buscarDocumento && (
                <div className="mt-8">
                    <SocializacionEvaluationListEmploye
                        key={buscarDocumento}
                        docuemntoEmpleado={buscarDocumento}
                    />
                </div>
            )}
        </div>
    );
}
