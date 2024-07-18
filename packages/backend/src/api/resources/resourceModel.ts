import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
export const ResourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  publish: z.boolean(),
  type: z.string(),
  tags: z.string(),
});
export type Resource = z.infer<typeof ResourceSchema>;
