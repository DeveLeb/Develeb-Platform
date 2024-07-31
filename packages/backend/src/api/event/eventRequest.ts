import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

import { EventSchema } from './eventModel';

export const GetEventsSchema = z.object({
  query: z.object({
    pageIndex: commonValidations.pageIndex,
    pageSize: commonValidations.pageSize,
    typeId: commonValidations.stringId.optional(),
    title: z.string().optional(),
  }),
});
export type GetEventsRequest = z.infer<typeof GetEventsSchema>['query'];

export type GetEventRequest = z.infer<typeof GetEventSchema>;
export const GetEventSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateEventRequest = z.infer<typeof CreateEventSchema>;
export const CreateEventSchema = z.object({
  body: EventSchema.omit({ id: true, createdAt: true, updatedAt: true, postedAt: true }),
});

export type UpdateEventRequest = z.infer<typeof UpdateEventSchema>;
export const UpdateEventSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: EventSchema.omit({ id: true, createdAt: true, updatedAt: true, postedAt: true }).partial(),
});
