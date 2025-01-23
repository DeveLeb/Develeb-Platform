import { z } from 'zod';

export const GetResourceViewsResponse = z.object({
  id: z.string(),
  totalViews: z.number(),
});
