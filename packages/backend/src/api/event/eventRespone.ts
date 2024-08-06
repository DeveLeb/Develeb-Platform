import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

export type EventRegistrationRespone = z.infer<typeof EventRegistrationSchema>;
export const EventRegistrationSchema = z.object({
  id: commonValidations.numId,
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
  userType: z.string(),
});

export type EventSavedRespone = z.infer<typeof EventSavedSchema>;
export const EventSavedSchema = z.object({
  message: z.string(),
});
