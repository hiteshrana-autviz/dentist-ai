export interface PaginatedResult<T> {
    patients: T[];  
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  }