export type PaginationQuery = { page?: number; pageSize?: number };

export function parsePagination(query: PaginationQuery) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  return { page, pageSize, skip: (page - 1) * pageSize };
}

export function buildPage<T>(
  items: T[],
  meta: { page: number; pageSize: number; totalItem: number },
) {
  return {
    page: meta.page,
    pageSize: meta.pageSize,
    totalItem: meta.totalItem,
    totalPage: Math.ceil(meta.totalItem / meta.pageSize),
    items,
  };
}
