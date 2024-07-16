import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Job = z.infer<typeof JobSchema>;
export const JobSchema = z.object({
  title: z.string().optional(),
  level_id: z.number().optional(),
  category_id: z.number().optional(),
  location: z.string().optional(),
  type_id: z.number().optional(),
  description: z.string().optional(),
  compensation: z.string().optional(),
  application_link: z.string().url().optional(),
  is_external: z.boolean().optional(),
  company_id: z.string().optional(),
  tags: z.string().optional(),
});

export type createJob = z.infer<typeof createJobSchema>;
export const createJobSchema = z.object({
  title: z.string(),
  level_id: z.number(),
  category_id: z.number(),
  location: z.string(),
  type_id: z.number(),
  description: z.string(),
  compensation: z.string(),
  application_link: z.string().url(),
  is_external: z.boolean(),
  company_id: z.string(),
  tags: z.string(),
});

export type JobCategory = z.infer<typeof JobCategorySchema>;
export const JobCategorySchema = z.object({
  title: z.string().min(2),
});
