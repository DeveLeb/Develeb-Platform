import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

export const GetJobsSchema = z.object({
  query: z.object({
    pageIndex: commonValidations.pageIndex,
    pageSize: commonValidations.pageSize,
    categoryId: commonValidations.stringId.optional(),
    levelId: commonValidations.stringId.optional(),
    companyName: z.string().optional(),
  }),
});
export type GetJobsRequest = z.infer<typeof GetJobsSchema>['query'];

export const CreateJobSchema = z.object({
  body: z.object({
    title: z.string(),
    levelId: commonValidations.numId,
    categoryId: commonValidations.numId,
    typeId: commonValidations.numId,
    location: z.string(),
    description: z.string().optional(),
    compensation: z.string().optional(),
    applicationLink: z.string().optional(),
    isExternal: z.boolean().default(false),
    companyId: z.string().optional(),
    tags: z.string().optional(),
  }),
});
export type CreateJobRequest = z.infer<typeof CreateJobSchema>['body'];

export const CreateJobCategorySchema = z.object({
  body: z.object({
    title: z.string(),
  }),
});
export type CreateJobCategoryRequest = z.infer<typeof CreateJobCategorySchema>['body'];

export const GetJobCategorySchema = z.object({
  params: z.object({
    id: commonValidations.stringId,
  }),
});
export type GetJobCategoryRequest = z.infer<typeof GetJobCategorySchema>['params'];

export const PutJobCategorySchema = z.object({
  params: z.object({
    id: commonValidations.stringId,
  }),
  body: z.object({
    title: z.string(),
  }),
});
export type PutJobCategoryRequest = z.infer<typeof PutJobCategorySchema>;

export const DeleteJobCategorySchema = GetJobCategorySchema;
export type DeleteJobCategoryRequest = z.infer<typeof DeleteJobCategorySchema>['params'];

export const PutJobSchema = z.object({
  body: CreateJobSchema,
});
export type PutJobRequest = z.infer<typeof PutJobSchema>['body'];
