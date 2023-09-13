type PaginationRes = {
  total_page: number;
  total: number;
  current_page: number;
};

export type Res<TData> = {
  status?: string;
  code?: number;
  data: TData;
  pagination: PaginationRes;
  error: any;
};
