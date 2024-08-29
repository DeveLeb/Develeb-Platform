export const calculateOffset = (pageIndex: number, pageSize: number): number => {
  return (pageIndex - 1) * pageSize;
};
