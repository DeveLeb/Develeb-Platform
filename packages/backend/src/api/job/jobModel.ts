import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

extendZodWithOpenApi(z);

// export type createJob = z.infer<typeof updateJobSchema>;
// export const updateJobSchema = z.object({
//   title: z.string().optional(),
//   level_id: z.number().optional(),
//   category_id: z.number().optional(),
//   location: z.string().optional(),
//   type_id: z.number().optional(),
//   description: z.string().optional(),
//   compensation: z.string().optional(),
//   application_link: z.string().url().optional(),
//   is_external: z.boolean().optional(),
//   company_id: z.string().optional(),
//   tags: z.string().optional(),
//   posted_at: z.date().optional(),
// });

export type Job = z.infer<typeof JobSchema>;
export const JobSchema = z.object({
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
  posted_at: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  is_approved: z.boolean(),
});

// export const JobSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   levelId: z.number(),
//   categoryId: z.number(),
//   typeId: z.number(),
//   location: z.string().nullable(),
//   description: z.string().nullable(),
//   compensation: z.string().nullable(),
//   applicationLink: z.string().nullable(),
//   isExternal: z.boolean(), // Note: Changed from boolean | null to just boolean
//   companyId: z.string().nullable(),
//   createdAt: z.date().nullable(),
//   updatedAt: z.date().nullable(),
//   postedAt: z.date().nullable(),
//   tags: z.string().nullable(),
//   isApproved: z.boolean().nullable(),
// });

// export type Job = z.infer<typeof JobSchema>;

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
