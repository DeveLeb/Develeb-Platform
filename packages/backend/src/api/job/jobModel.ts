import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

extendZodWithOpenApi(z);

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
// export const JobSchema = z
//   .object({
//     id: z.string().uuid(),
//     title: z.string().min(2, 'Title cannot be empty').max(100, 'Title is too long'),
//     levelId: z.number().int().positive('Level ID must be a positive integer'),
//     categoryId: z.number().int().positive('Category ID must be a positive integer'),
//     typeId: z.number().int().positive('Type ID must be a positive integer'),
//     location: z.string().min(1, 'Location cannot be empty').max(100, 'Location is too long'),
//     description: z.string().min(10, 'Description is too short').max(5000, 'Description is too long'),
//     compensation: z.string().min(1, 'Compensation cannot be empty').max(100, 'Compensation description is too long'),
//     applicationLink: z.string().url('Application link must be a valid URL'),
//     isExternal: z.boolean(),
//     companyId: z.string().uuid().nullable(),
//     createdAt: z.union([z.string().datetime(), z.date()]),
//     updatedAt: z.union([z.string().datetime(), z.date()]),
//     postedAt: z.union([z.string().datetime(), z.date(), z.null()]),
//     tags: z.string().max(500, 'Tags are too long'),
//     isApproved: z.boolean(),
//     categoryTitle: z.string().optional(),
//     levelTitle: z.string().optional(),
//     companyName: z.string().nullable().optional(),
//   })
//   .refine(
//     (data) => {
//       if (data.isExternal && !data.applicationLink) {
//         return false;
//       }
//       return true;
//     },
//     {
//       message: 'External jobs must have an application link',
//       path: ['applicationLink'],
//     }
//   );

export type JobRequest = z.infer<typeof createJobSchema>;
export const createJobSchema = z.object({
  title: z.string(),
  levelId: z.number(),
  categoryId: z.number(),
  typeId: z.number(),
  location: z.string(),
  description: z.string(),
  compensation: z.string(),
  applicationLink: z.string(),
  isExternal: z.boolean(),
  companyId: z.string(),
  tags: z.string(),
});

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
