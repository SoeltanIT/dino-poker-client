export const getTotalPage = (total: number, pageSize: number) => {
  return Math.ceil(total / pageSize)
}
