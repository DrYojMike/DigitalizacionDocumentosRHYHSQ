"use client";

import { useEffect, useMemo, useState } from "react";
import { httpClient } from "@/app/services/api/client";
import { ApiError, ApiResponse } from "@/app/services/api/types";
import { sileo } from "sileo";

interface Area {
  id: number;
  Area: string;
  cantEvaluaciones: number;
  notMaxima: number;
  notMaxEvaluacion: number;
  promedio: number;
}

interface Competencia {
  id: number;
  competencia: string;
  descripcion: string;
  cantEvaluaciones: number;
  notMaxima: number;
  notMaxEvaluacion: number;
  promedio: number;
}

interface Gestion {
  id: number;
  indicador: string;
  cantEvaluaciones: number;
  notMaxima: number;
  notMaxEvaluacion: number;
  promedio: number;
}

interface IndicadoresArea {
  anio: number;
  areas: Area[];
}

interface IndicadoresCompetencia {
  Anio: number;
  competencias: Competencia[];
}

interface IndicadoresGestion {
  Año: number;
  indicadores: Gestion[];
}

interface Indicadores {
  indicadorGestion: IndicadoresGestion[];
  indicadorCompetencia: IndicadoresCompetencia[];
  indicadorAreas: IndicadoresArea[];
}

export default function IndicadoresView() {
  const [data, setData] = useState<Indicadores | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [year, setYear] = useState("");

    const getIndicators = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.get<ApiResponse<Indicadores>>(
        "evaluacion/indicadores/"
      );

      const indicadores = response.data.data;

      setData(indicadores);

      const years = [
        ...new Set([
          ...indicadores.indicadorAreas.map((x) => x.anio),
          ...indicadores.indicadorCompetencia.map((x) => x.Anio),
          ...indicadores.indicadorGestion.map((x) => x.Año),
        ]),
      ].sort((a, b) => b - a);

      if (years.length > 0) {
        setYear(String(years[0]));
      }

      sileo.success({
        description: response.data.message,
      });
    } catch (err) {
      const error = err as ApiError;

      console.error(error);

      setError(error.message);

      sileo.error({
        title: `Error ${error.status}`,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIndicators();
  }, []);

  const areas = useMemo(() => {
    return (
      data?.indicadorAreas.find(
        (x) => String(x.anio) === year
      )?.areas ?? []
    );
  }, [data, year]);

  const competencias = useMemo(() => {
    return (
      data?.indicadorCompetencia.find(
        (x) => String(x.Anio) === year
      )?.competencias ?? []
    );
  }, [data, year]);

  const indicadores = useMemo(() => {
    return (
      data?.indicadorGestion.find(
        (x) => String(x.Año) === year
      )?.indicadores ?? []
    );
  }, [data, year]);

  const indicadoresFiltrados = useMemo(() => {
    return indicadores.filter((item) =>
      item.indicador.toLowerCase().includes(search.toLowerCase())
    );
  }, [indicadores, search]);

  const years = useMemo(() => {
    if (!data) return [];

    return [
      ...new Set([
        ...data.indicadorAreas.map((x) => x.anio),
        ...data.indicadorCompetencia.map((x) => x.Anio),
        ...data.indicadorGestion.map((x) => x.Año),
      ]),
    ]
      .sort((a, b) => b - a)
      .map(String);
  }, [data]);

  const promedioGeneral =
    areas.length > 0
      ? areas.reduce((acc, item) => acc + item.promedio, 0) / areas.length
      : 0;

  const progressColor = (value: number) => {
    if (value >= 85) return "bg-green-500";
    if (value >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
          <p className="text-gray-600">Cargando indicadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-red-600 text-2xl font-bold mb-2">
            Ocurrió un error
          </h2>

          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold">
            No existen indicadores registrados.
          </h2>
        </div>
      </div>
    );
  }

  const Card = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <div className="rounded-xl bg-white shadow-md p-6">
      <p className="text-gray-500">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );

  const Section = ({
    title,
    children,
  }: React.PropsWithChildren<{
    title: string;
  }>) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </div>
  );

  const Progress = ({
    title,
    value,
    extra,
  }: {
    title: string;
    value: number;
    extra?: string;
  }) => (
    <div>
      <div className="flex justify-between mb-2">
        <div>
          <p className="font-semibold">{title}</p>

          {extra && (
            <p className="text-sm text-gray-500">
              {extra}
            </p>
          )}
        </div>

        <span className="font-bold">
          {value.toFixed(2)}%
        </span>
      </div>

      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${progressColor(value)} h-full transition-all duration-500`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
    return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Informe de Indicadores
            </h1>

            <p className="text-gray-500 mt-1">
              Comparativo anual de desempeño
            </p>
          </div>

          <div>

            <label className="block text-sm text-gray-500 mb-1">
              Año
            </label>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {years.map((y) => (
                <option
                  key={y}
                  value={y}
                >
                  {y}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Tarjetas */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <Card
            title="Áreas"
            value={areas.length}
          />

          <Card
            title="Competencias"
            value={competencias.length}
          />

          <Card
            title="Indicadores"
            value={indicadores.length}
          />

          <Card
            title="Promedio General"
            value={`${promedioGeneral.toFixed(2)} %`}
          />

        </div>

        {/* Áreas */}

        <Section title="Indicadores por Área">

          {areas.map((area) => (

            <Progress
              key={area.id}
              title={area.Area}
              value={area.promedio}
              extra={`${area.cantEvaluaciones} evaluaciones`}
            />

          ))}

        </Section>

        {/* Competencias */}

        <Section title="Competencias">

          {competencias.map((comp) => (

            <Progress
              key={comp.id}
              title={comp.competencia}
              value={comp.promedio}
              extra={comp.descripcion}
            />

          ))}

        </Section>

        {/* Indicadores */}

        <Section title="Indicadores">
          <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2">
            {indicadoresFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron indicadores.
              </div>
            ) : (
              indicadoresFiltrados.map((item) => (
                <Progress
                  key={item.id}
                  title={item.indicador}
                  value={item.promedio}
                  extra={`${item.cantEvaluaciones} evaluaciones`}
                />
              ))
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}