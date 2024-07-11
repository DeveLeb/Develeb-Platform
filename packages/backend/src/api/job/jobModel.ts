/* eslint-disable prettier/prettier */
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Job = z.infer<typeof JobSchema>;
export const JobSchema = z.object({
  title: z.string().optional(),
  level_id: z.string().optional(),
  category_id: z.string().optional(),
  location: z.string().optional(),
  type_id:z.string(),
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
  level_id: z.string(),
  category_id: z.string(),
  location: z.string(),
  type_id:z.string(),
  description: z.string(),
  compensation: z.string(),
  application_link: z.string().url(),
  is_external: z.boolean(),
  company_id: z.string(),
  tags: z.string(),
});


export type JobPatch = z.infer<typeof JobPatchSchema>;
export const JobPatchSchema = z.object({
  title: z.string().optional(),
  levelId: z.string().optional(),
  categoryId: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  compensation: z.string().optional(),
  applicationLink: z.string().url().optional(),
  isExternal: z.boolean().optional(),
  companyId: z.string().optional(),
  tags: z.string().optional(),
});

export type JobCategory = z.infer<typeof JobCategorySchema>
export const JobCategorySchema = z.object({
  title: z.string().min(2)
})