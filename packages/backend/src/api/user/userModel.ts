import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '../../common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2, 'Full name cannot be empty').max(100, 'Full name is too long'),
  email: z.string().email(),
  password: z.string(),
  username: z.string().min(2, 'Username cannot be empty').max(100, 'Username is too long'),
  profileUrl: z.string().optional(),
  isVerified: z.boolean().default(false),
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
  levelId: z.number().int().positive('Level ID must be a positive integer'),
  phoneNumber: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  tags: z.string().optional(),
  role: z.string().default('user'),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.numId }),
});
