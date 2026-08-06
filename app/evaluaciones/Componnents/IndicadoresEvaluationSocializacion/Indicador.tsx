"use client";

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

interface Indicador {
    nombre?: string;
    nomber?: string;
    nota: number;
}

interface Props {
    indicadores: Indicador[];
}

export default function EvaluationIndicators({
    indicadores,
}: Props) {

    const promedio =
        indicadores.length > 0
            ? indicadores.reduce((acc, item) => acc + item.nota, 0) /
              indicadores.length
            : 0;

    const getColor = (nota: number) => {
        if (nota >= 90) return { text: "text-emerald-600", bar: "#10b981", dot: "bg-emerald-500" };
        if (nota >= 70) return { text: "text-amber-600", bar: "#f59e0b", dot: "bg-amber-500" };
        return { text: "text-red-600", bar: "#ef4444", dot: "bg-red-500" };
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-500 bg-white shadow-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Resultados de la evaluación
                        </h2>
                        <p className="text-sm text-gray-500">
                            {indicadores.length} indicadores evaluados
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-200">
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Calificación General
                        </p>
                        <p className="text-3xl font-extrabold text-gray-800">
                            {promedio.toFixed(1)}%
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        promedio >= 90 ? "bg-emerald-100 text-emerald-700" :
                        promedio >= 70 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                    }`}>
                        {promedio >= 90 ? "🌟" : promedio >= 70 ? "📊" : "🎯"}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-2">
                {/* Lista de indicadores en 2 columnas */}
                <div className="border-r border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Detalle por indicador
                        </h3>
                        <span className="text-xs text-gray-400">
                            {indicadores.length} items
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {indicadores.map((item, index) => {
                            const nombre = item.nombre ?? item.nomber ?? "";
                            const colors = getColor(item.nota);
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                                >
                                    <span className="text-sm text-gray-700 truncate pr-2">
                                        {nombre}
                                    </span>
                                    <span className={`text-sm font-bold whitespace-nowrap ${colors.text}`}>
                                        {item.nota}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Gráfico */}
                <div className="h-[450px] p-6 bg-gradient-to-b from-white to-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Visualización
                        </h3>
                        <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                Alto
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                Medio
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                Bajo
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={indicadores}
                            margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey={(item: Indicador) =>
                                    item.nombre ?? item.nomber
                                }
                                angle={-25}
                                interval={0}
                                textAnchor="end"
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                height={60}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    padding: '12px'
                                }}
                            />
                            <Bar
                                dataKey="nota"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={60}
                            >
                                {indicadores.map((item, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            item.nota >= 90
                                                ? "#10b981"
                                                : item.nota >= 70
                                                ? "#f59e0b"
                                                : "#ef4444"
                                        }
                                        className="transition-opacity hover:opacity-80"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}