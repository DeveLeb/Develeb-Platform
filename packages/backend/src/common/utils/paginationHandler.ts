import { like } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

export const queryFilters = (entity: PgTableWithColumns<any>, filters: { [key: string]: string | undefined }) => {
  const returnedFilters = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      returnedFilters.push(like(entity[key], `%${value}%`));
    }
  }
  return returnedFilters;
};

export const calculateOffset = (pageIndex: number, pageSize: number): number => {
  return (pageIndex - 1) * pageSize;
};
