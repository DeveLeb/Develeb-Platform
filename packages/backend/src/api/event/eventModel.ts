import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Event = z.infer<typeof EventSchema>;

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, 'Title cannot be empty').max(100, 'Title is too long'),
  description: z.string().min(2, 'Description cannot be empty').max(500, 'Description is too long'),
  videoLink: z.string().url(),
  flyerLink: z.string().url(),
  date: z
    .string()
    .datetime()
    .transform((val) => {
      if (val) return new Date(val);
    }),
  location: z.string().min(2, 'Location cannot be empty').max(100, 'Location is too long'),
  speakerName: z.string().min(2, 'Speaker Name cannot be empty').max(100, 'Speaker Name is too long'),
  speakerDescription: z
    .string()
    .min(2, 'Speaker Description cannot be empty')
    .max(100, 'Speaker Description is too long'),
  speakerProfileUrl: z.string().url(),
  typeId: z.number().int().positive('Level ID must be a positive integer'),
  tags: z.string().max(500, 'Tags are too long'),
  postedAt: z.union([z.string().datetime(), z.string().date(), z.null()]).transform((val) => {
    if (val) return new Date(val);
  }),
  createdAt: z.union([z.string().datetime(), z.string().date(), z.null()]).transform((val) => {
    if (val) return new Date(val);
  }),
  updatedAt: z.union([z.string().datetime(), z.string().date(), z.null()]).transform((val) => {
    if (val) return new Date(val);
  }),
});

export type Registration = z.infer<typeof RegistrationSchema>;

export const RegistrationSchema = z.object({
  id: commonValidations.numId,
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
  // user type can only be "Attendee" and "Speaker"
  userType: z.enum(['Attendee', 'Speaker']),
});

export type SaveEvent = z.infer<typeof SaveEventSchema>;
export const SaveEventSchema = RegistrationSchema.omit({
  userType: true,
});
