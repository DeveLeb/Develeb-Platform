import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  body: z.object({
    email: commonValidations.email,
    username: z.string(),
    password: commonValidations.password,
    full_name: z.string(),
    phone_number: z.string(),
    level_id: commonValidations.numId,
    category_id: commonValidations.numId,
  }),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>['body'];

export const GetUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type GetUserRequest = z.infer<typeof GetUserSchema>['params'];

export const GetUsersSchema = z.object({
  query: z.object({
    pageIndex: commonValidations.pageIndex,
    pageSize: commonValidations.pageSize,
    username: z.string().optional(),
    email: commonValidations.email.optional(),
  }),
});

export type GetUsersRequest = z.infer<typeof GetUsersSchema>['query'];

export const UpdateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    full_name: z.string(),
    level_id: commonValidations.numId,
    category_id: commonValidations.numId,
    tags: z.string().optional(),
  }),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

export const DeleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type DeleteUserRequest = z.infer<typeof DeleteUserSchema>['params'];

export const LoginUserSchema = z.object({
  body: z.object({
    email: commonValidations.email,
    password: z.string(),
  }),
});

export type LoginUserRequest = z.infer<typeof LoginUserSchema>['body'];

export const UserRefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export type UserRefreshRequest = z.infer<typeof UserRefreshTokenSchema>['body'];

export const UserResetPasswordSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    password: commonValidations.password,
  }),
});

export type UserResetPasswordRequest = z.infer<typeof UserResetPasswordSchema>;