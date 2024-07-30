import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Resource = z.infer<typeof ResourceSchema>;
export const ResourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, 'Title cannot be empty').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description is too short').max(5000, 'Description is too long'),
  link: z.string().url('Link must be a valid URL'),
  publish: z.boolean().default(false),
  tags: z.string(),
  type: z.string(),
});
