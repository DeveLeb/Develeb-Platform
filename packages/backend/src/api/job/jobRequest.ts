import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

export const GetJobsSchema = z.object({
  query: z.object({
    pageIndex: commonValidations.pageIndex,
    pageSize: commonValidations.pageSize,
    categoryId: commonValidations.id.optional(),
    levelId: commonValidations.id.optional(),
    companyName: z.string().optional(),
  }),
});
