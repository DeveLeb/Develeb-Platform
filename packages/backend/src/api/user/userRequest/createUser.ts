import { z } from 'zod';

export const createUserRequest = z.object({
  body: z.object({
    email: z.string(),
    username: z.string(),
    password: z.string(),
    full_name: z.string(),
    phone_number: z.string(),
    level_id: z.number(),
    category_id: z.number(),
  }),
});

export type CreateUserRequest = {
  email: string;
  username: string;
  password: string;
  full_name: string;
  phone_number: string;
  level_id: number;
  category_id: number;
};

