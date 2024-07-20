import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

extendZodWithOpenApi(z);

// export const JobSchema = z.object({
//   id: z.string().uuid(),
//   title: z.string(),
//   levelId: z.number(),
//   categoryId: z.number(),
//   typeId: z.number(),
//   location: z.string(),
//   description: z.string(),
//   compensation: z.string(),
//   applicationLink: z.string(), // Removed .url() to allow any string
//   isExternal: z.boolean(),
//   companyId: z.string().nullable(),
//   createdAt: z.string(),
//   updatedAt: z.string(),
//   postedAt: z.string().datetime().nullable(),
//   tags: z.string(),
//   isApproved: z.boolean(),
// });
export type Job = z.infer<typeof JobSchema>;
export const JobSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  levelId: z.number(),
  categoryId: z.number(),
  typeId: z.number(),
  location: z.string(),
  description: z.string(),
  compensation: z.string(),
  applicationLink: z.string(),
  isExternal: z.boolean(),
  companyId: z.string().nullable(),
  createdAt: z.union([z.string().datetime(), z.date()]),
  updatedAt: z.union([z.string().datetime(), z.date()]),
  postedAt: z.union([z.string().datetime(), z.date(), z.null()]),
  tags: z.string(),
  isApproved: z.boolean(),
  categoryTitle: z.string().optional(),
  levelTitle: z.string().optional(),
  companyName: z.string().nullable().optional(),
});
//////////////////////////

//////////////////////////////////////
export type JobCategory = z.infer<typeof JobCategorySchema>;
export const JobCategorySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2),
});

export const GetCategorySchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export type SavedJob = z.infer<typeof JobSavedSchema>;
export const JobSavedSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  userId: z.string(),
  savedAt: z.date(),
});

export const GetJobSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid UUID format') }),
});

export const GetJobViews = z.object({
  id: z.string(),
  totalViews: z.number(),
});
