import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Resource = z.infer<typeof ResourceSchema>;
export const ResourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
  publish: z.boolean().optional(),
  type: z.string().optional(),
  tags: z.string().optional(),
});
