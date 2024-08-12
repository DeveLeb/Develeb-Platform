import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

import { EventSchema, RegistrationSchema, SaveEventSchema } from './eventModel';

export const GetAllEventSchema = z.object({
  query: z.object({
    pageIndex: commonValidations.pageIndex,
    pageSize: commonValidations.pageSize,
    typeId: commonValidations.stringId.optional(),
    title: z.string().optional(),
  }),
});
export type GetAllEventRequest = z.infer<typeof GetAllEventSchema>['query'];

export const GetEventSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  query: GetAllEventSchema.shape.query,
});
export type GetEventRequest = z.infer<typeof GetEventSchema>['query'];

export type CreateEventRequest = z.infer<typeof CreateEventSchema>;
export const CreateEventSchema = z.object({
  body: EventSchema.omit({ id: true, createdAt: true, updatedAt: true, postedAt: true }),
});

export type UpdateEventRequest = z.infer<typeof UpdateEventSchema>;
export const UpdateEventSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: EventSchema.omit({ id: true, createdAt: true, updatedAt: true, postedAt: true }).partial(),
});

export type RegisterEventRequest = z.infer<typeof RegisterEventSchema>;
export const RegisterEventSchema = z.object({
  params: RegistrationSchema.omit({ id: true, userType: true }),
  body: RegistrationSchema.pick({ userType: true }).partial(),
});

export type SaveEventRequest = z.infer<typeof SaveEventRequestSchema>;
export const SaveEventRequestSchema = z.object({
  params: SaveEventSchema.pick({ eventId: true, userId: true }),
});

export type GetRegistrationRequest = z.infer<typeof GetRegistrationSchema>;
export const GetRegistrationSchema = z.object({
  params: RegistrationSchema.pick({ eventId: true }),
});
