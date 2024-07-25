import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '../../common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  profileUrl: z.string(),
  isVerified: z.boolean(),
  categoryId: z.number(),
  levelId: z.number(),
  phoneNumber: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.string(),
  role: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
