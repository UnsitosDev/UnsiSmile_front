// store.interface.ts
export interface IStore {
  arcada: IArcada;
}

export interface toothOptions {
  idCondition: number;
  name: string;
  uiTooth: uiTooth;
}

export interface uiTooth {
  color?: string;
  icon?: string;
  all?: string;
}

export interface tooth {
  id: number;
  name: string;
  status: boolean;
  css?: string;
  faces: faces[]

}

export interface faces {
  id: string;
  name: string;
  estado: string;
  idCondition: number;
}

export interface IArcada {
  adulto: tooth[];
  infantil: tooth[];
}

export interface IMarked {
  idCondition: number;
  selecionado: string;
  uiTooth: uiTooth;
}