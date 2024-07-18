// store.interface.ts
export interface IStore {
  marked: IMarked;
  toolbar: {
    opcoes: toothOptions[];
  };
  arcada: IArcada;
}

export interface toothOptions {
  idCondition: number;
  nome: string;
  uiTooth: uiTooth;
}

export interface uiTooth {
  cor?: string;
  icon?: string;
  all?: string;
}

export interface tooth {
  id: number;
  nome: string;
  status: boolean;
  css?: string;
  faces: faces[]

}

export interface faces {
  id: string;
  nome: string;
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