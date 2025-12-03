export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC"
}


export class Paginated<T> {
  constructor(
    public data: T[],
    public total: number,
    public page: number,
    public limit: number,
  ) { }
}
