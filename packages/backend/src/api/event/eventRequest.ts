import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

import { EventSchema, RegisterationSchema } from './eventModel';

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

export type SaveEventRequest = z.infer<typeof SaveEventSchema>;
export const SaveEventSchema = z.object({
  params: RegisterationSchema.omit({
    id: true,
    userType: true,
  }),
});
