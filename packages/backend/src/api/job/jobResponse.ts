import { z } from 'zod';

export const GetJobViewsSchema = z.object({
  id: z.string(),
  totalViews: z.number(),
});

export type JobCategory = z.infer<typeof JobCategorySchema>;
export const JobCategorySchema = z.object({
  id: z.number(),
  title: z.string().min(2),
});

export type JobLevel = z.infer<typeof JobLevelSchema>;
export const JobLevelSchema = z.object({
  id: z.number(),
  title: z.string().min(2),
});