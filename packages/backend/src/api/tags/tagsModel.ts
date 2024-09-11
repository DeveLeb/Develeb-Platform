import { commonValidations } from 'src/common/utils/commonValidation';
import { z } from 'zod';

export const TagSchema = z.object({
  id: commonValidations.numId,
  name: z.string().max(100, 'Tag name is too long'),
});
export type Tag = z.infer<typeof TagSchema>;

export const TagSchemaRequest = z.object({
  id: commonValidations.numId,
});
