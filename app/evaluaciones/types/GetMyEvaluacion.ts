
interface Indicador {
  idIndicador: number;
  indicador: string;
  nota: number;
  notaJefe: number;
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

interface Compromiso {
  idCompromiso: number;
  compromiso: string;
}

export interface EvaluacionCompleta {
  usuario: string;
  jefe: string;
  fecha: string;
  areas: Area[];
  compromisos: Compromiso[];
}