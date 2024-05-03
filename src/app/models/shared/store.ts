// store.interface.ts
export interface Store {
  marked: {
    idCondition: number;
    selecionado: string;
    uiTooth: {
      cor: string;
      all?: string;
    };
  };
  toolbar: {
    opcoes: toothOptions[];
  };
  arcada: {
    adulto: {
      id: number;
      nome: string;
      status: boolean;
      css?: string;
      faces: {
        id: string;
        nome: string;
        estado: string;
        idEstado: number;
      }[];
    }[];
    infantil: {
      id: number;
      nome: string;
      status: boolean;
      css?: string;
      faces: {
        id: string;
        nome: string;
        estado: string;
        idEstado: number;
      }[];
    }[];
  };
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
