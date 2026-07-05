interface Indicador {
  idIndicador: number;
  indicador: string;
  nota: number;
}

interface Competencia {
  idCompetencia: number;
  nombre: string;
  descripcion: string;
  indicadores: Indicador[];
}

interface Area {
  idArea: number;
  area: string;
  competencias: Competencia[];
}

export interface Evaluacion {
  idEvaluacion: number;
  idEmpleado: string;
  idJefe: string;
  fecha: string;
  areas: Area[];
}