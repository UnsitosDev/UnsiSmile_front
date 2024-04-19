// store.interface.ts
export interface Store {
    marked: {
      selecionado: string;
      cor: string;
    };
    toolbar: {
      opcoes: {
        nome: string;
        cor?: string;
        icon?: string;
        all?: boolean
      }[];
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
        }[];
      }[];
    };
  }
  