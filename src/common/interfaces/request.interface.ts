export interface IPageParams {
  current: number;
  pageSize: number;
  /** 排序字段 */
  sortField?: string;
  /** 升序降序 */
  sortDirection?: 'ASC' | 'DESC';
  [key: string]: any;
}

export interface IPageWhere {
  likes?: string[];
  times?: { field: string; start: string; end: string }[];
}
