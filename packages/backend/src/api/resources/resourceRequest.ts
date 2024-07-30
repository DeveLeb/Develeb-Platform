import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

export const GetResourcesSchema = z.object({
  query: z.object({
    pageIndex: commonValidations.pageIndex,
    pageSize: commonValidations.pageSize,
    type: z.string().optional(),
    title: z.string().optional(),
  }),
});
export type GetResourcesRequest = z.infer<typeof GetResourcesSchema>['query'];

export const CreateResourceSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    link: z.string(),
    publish: z.boolean().optional(),
    type: z.string().optional(),
    tags: z.string().optional(),
  }),
});
export type CreateResourceRequest = z.infer<typeof CreateResourceSchema>['body'];

export const PutResourceSchema = z.object({
  body: CreateResourceSchema,
});
export type PutResourceRequest = z.infer<typeof PutResourceSchema>['body'];
