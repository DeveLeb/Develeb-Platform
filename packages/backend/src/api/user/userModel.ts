import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '../../common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1, 'Full name cannot be empty').max(100, 'Full name cannot exceed 100 characters.'),
  email: z.string().email(),
  password: z.string(),
  username: z.string().min(1, 'Username cannoy be empty').max(20, 'Username too long'),
  profileUrl: z.string().optional(),
  isVerified: z.boolean(),
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
  levelId: z.number().int().positive('Level ID must be a positive integer'),
  phoneNumber: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.string().optional(),
  role: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.numId }),
});
