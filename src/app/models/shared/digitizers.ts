export interface IDigitizers {
  idMedicalRecordDigitizer: number;
  studentFullName: string;
  idStudent: string;
  startDate: string;
  endDate: string;
}

export class digitizersTableData {
  id = 0;
  nombreCompleto = '';
  matricula = '';
  fechaInicio = '';
  fechaFin = '';
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
