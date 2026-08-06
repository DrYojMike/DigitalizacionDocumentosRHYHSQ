"use client";

import { useState } from "react";

interface Props {
    loading: boolean;
    onSubmit: (compromisos: string[]) => Promise<void>;
}

export default function SocializationForm({
    loading,
    onSubmit,
}: Props) {

    const [compromisos, setCompromisos] = useState<string[]>([""]);

    const addCompromiso = () => {
        setCompromisos([...compromisos, ""]);
    };

    const removeCompromiso = (index: number) => {
        if (compromisos.length === 1) {
            setCompromisos([""]);
        } else {
            setCompromisos(compromisos.filter((_, i) => i !== index));
        }
    };

    const updateCompromiso = (index: number, value: string) => {
        const copia = [...compromisos];
        copia[index] = value;
        setCompromisos(copia);
    };

    const handleSubmit = async () => {
        const filtrados = compromisos.filter((item) => item.trim() !== "");
        if (filtrados.length === 0) {
            alert("Debes agregar al menos un compromiso");
            return;
        }
        await onSubmit(filtrados);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index === compromisos.length - 1) {
                addCompromiso();
            }
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Registrar Socialización
                        </h2>
                        <p className="text-sm text-blue-100">
                            Define los compromisos adquiridos durante la socialización
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                <div className="space-y-3">
                    {compromisos.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-600">
                                {index + 1}
                            </div>
                            <input
                                value={item}
                                onChange={(e) =>
                                    updateCompromiso(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                placeholder={`Describe el compromiso ${index + 1}`}
                                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => removeCompromiso(index)}
                                disabled={loading}
                                className="flex-shrink-0 p-2.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                title="Eliminar compromiso"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Botones */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={addCompromiso}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar compromiso
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Socializar evaluación
                            </>
                        )}
                    </button>
                </div>

                {/* Info */}
                <p className="mt-4 text-xs text-gray-400 text-center">
                    Presiona <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> para agregar un nuevo compromiso automáticamente
                </p>
            </div>
        </div>
    );
}