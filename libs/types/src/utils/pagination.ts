export interface Pagination {
  /**
   * Define the current page number
   */
  page: number;
  /**
  * Define total page number
  * Can be empty for dynamic pagination
  */
  total?: number

}
