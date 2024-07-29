import { z } from 'zod';

// Schema definitions
export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), 'Must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'ID must be a positive number'),
  pageIndex: z
    .string()
    .default('1')
    .refine((data) => !isNaN(Number(data)), 'Must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'Page index must be a positive number'),
  pageSize: z
    .string()
    .default('10')
    .refine((data) => !isNaN(Number(data)), 'Must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'Page size must be a positive number'),
};
