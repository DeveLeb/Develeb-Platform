import { z } from 'zod';

import { RegisterationSchema } from './eventModel';

export type RegisterationResponse = z.infer<typeof RegisterationSchema>;

export type EventSavedRespone = z.infer<typeof EventSavedSchema>;
export const EventSavedSchema = z.object({
  message: z.string(),
});
