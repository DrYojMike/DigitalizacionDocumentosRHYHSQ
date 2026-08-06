"use client";

interface CompromisoSocializacion {
    idCompromiso: number;
    descripcion: string;
}

interface CompromisoJefe {
    idCompromiso: number;
    descripcion: string;
}

interface Socializacion {
    idSocializacion: number;
    socializador: string;
    compromisos: CompromisoSocializacion[];
}

interface Props {
    socializacion: Socializacion | null;
    compromisosJefes: CompromisoJefe[];
}

export default function EvaluationCommitments({
    socializacion,
    compromisosJefes,
}: Props) {
    return (
        <div className="rounded-2xl border border-gray-500 bg-white shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-500 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Socialización
                        </h2>
                        <p className="text-sm text-gray-600">
                            Compromisos definidos durante la socialización de la evaluación
                        </p>
                    </div>
                </div>
            </div>

            {!socializacion ? (
                <div className="py-16 px-6 text-center">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">
                        La evaluación aún no ha sido socializada
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Los compromisos aparecerán una vez que se complete la socialización
                    </p>
                </div>
            ) : (
                <div className="space-y-6 p-6">
                    {/* Socializador */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Socializador
                                </p>
                                <p className="text-lg font-semibold text-gray-800">
                                    Gestión Humana
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compromisos en Grid de 2 columnas */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Compromisos del jefe */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                <h3 className="text-base font-semibold text-gray-700">
                                    Oportunidades de Mejora
                                </h3>
                                <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full font-medium">
                                    {compromisosJefes.length}
                                </span>
                            </div>
                            
                            {compromisosJefes.length === 0 ? (
                                <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200 h-full min-h-[120px] flex items-center justify-center">
                                    <p className="text-sm text-gray-400">
                                        El jefe ha considerado que esta evaluación no requiere compromisos de mejora
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {compromisosJefes.map((item, index) => (
                                        <div
                                            key={item.idCompromiso}
                                            className="group bg-white rounded-xl border border-gray-400 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-800 leading-relaxed">
                                                        {item.descripcion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Compromisos del empleado */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                                <h3 className="text-base font-semibold text-gray-700">
                                    Planes de Acción
                                </h3>
                                <span className="ml-auto text-xs bg-green-100 text-green-600 px-2.5 py-0.5 rounded-full font-medium">
                                    {socializacion.compromisos.length}
                                </span>
                            </div>

                            {socializacion.compromisos.length === 0 ? (
                                <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200 h-full min-h-[120px] flex items-center justify-center">
                                    <p className="text-sm text-gray-400">
                                        No se registraron compromisos
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {socializacion.compromisos.map((item, index) => (
                                        <div
                                            key={item.idCompromiso}
                                            className="group bg-white rounded-xl border border-gray-400 p-4 hover:border-green-300 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-xs font-semibold text-green-600 group-hover:bg-green-100 transition-colors">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-800 leading-relaxed">
                                                        {item.descripcion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}