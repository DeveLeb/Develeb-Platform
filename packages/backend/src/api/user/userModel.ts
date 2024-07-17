import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '../../common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string(),
  fullname: z.string(),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  profile_url: z.string(),
  is_verified: z.boolean(),
  category_id: z.number(),
  level_id: z.number(),
  phone_number: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  tags: z.string(),
  role: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
