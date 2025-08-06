
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  }
  
export interface Sort {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  }
  