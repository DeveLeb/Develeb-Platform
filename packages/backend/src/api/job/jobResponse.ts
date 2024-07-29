import { z } from 'zod';

export const GetJobViewsSchema = z.object({
  id: z.string(),
  totalViews: z.number(),
});
