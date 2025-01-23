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

export const GetResourceSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Resource ID is not a valid UUID' }),
  }),
});
export type GetResourceRequest = z.infer<typeof GetResourceSchema>['params'];

export const CreateResourceSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    link: z.string().min(1, { message: 'Link is required' }).url('link must be a valid url'),
    publish: z.boolean().optional(),
    type: z.string().optional(),
    tags: z.string().optional(),
  }),
});
export type CreateResourceRequest = z.infer<typeof CreateResourceSchema>['body'];

export const PutResourceSchema = z.object({
  body: CreateResourceSchema.shape.body,
  params: z.object({
    id: z.string().uuid({ message: 'Resource ID is not a valid UUID' }),
  }),
});
export type PutResourceRequest = z.infer<typeof PutResourceSchema>;

export const DeleteResourceSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Resource ID is not a valid UUID' }),
  }),
});
export type DeleteResourceRequest = z.infer<typeof DeleteResourceSchema>['params'];

export const SaveResourceSchema = z.object({
  params: z.object({
    resourceId: z.string().uuid({ message: 'Resource ID is not a valid UUID' }),
    userId: z.string().uuid({ message: 'User ID is not a valid UUID' }),
  }),
});
export type SaveResourceRequest = z.infer<typeof SaveResourceSchema>['params'];

export const GetUserSavedResourcesSchema = z.object({
  params: z.object({
    userId: z.string().uuid({ message: 'User ID is not a valid UUID' }),
  }),
});
export type GetUserSavedResourcesRequest = z.infer<typeof GetUserSavedResourcesSchema>['params'];

export const GetResourceViewsSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Resource ID is not a valid UUID' }),
  }),
});
export type GetResourceViewsRequest = z.infer<typeof GetResourceViewsSchema>['params'];
