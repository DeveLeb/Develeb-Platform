import { z } from 'zod';

export const GetResourceViewsSchema = z.object({
  id: z.string(),
  totalViews: z.number(),
});
