export interface Indicador {
  id: number;
  nombre: string;
}

export interface Competencia {
  nombre: string;
  descripcion: string;
  indicadores: Indicador[];
}

export interface Area {
  area: string;
  competencias: Competencia[];
}
