import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
export const ResourceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  link: z.string(),
  publish: z.boolean().optional(),
  type: z.string().optional(),
  tags: z.string().optional(),
});
export type Resource = z.infer<typeof ResourceSchema>;
