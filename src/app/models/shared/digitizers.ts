export interface IDigitizers {
  idMedicalRecordDigitizer: number;
  digitizerName: string;
  username: string;
  startDate: string; // Puede venir como string o se convierte si es arreglo
  status: boolean;
}

export interface digitizersTableData {
  id: number;
  nombreCompleto: string;
  matricula: string;
  fechaInicio: string;
  estatus: string;
}

export interface DigitizersResponse {
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  content: IDigitizers[];
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
