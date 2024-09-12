import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { z } from 'zod';
// Schema definitions
export const commonValidations = {
  stringId: z
    .string()
    .refine((data) => !isNaN(Number(data)), 'Must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'ID must be a positive number'),
  numId: z.number().refine((num) => num > 0, 'ID must be a positive number'),
  pageIndex: z
    .string()
    .default('1')
    .refine((data) => !isNaN(Number(data)), 'Must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'Page index must be a positive number'),
  pageSize: z
    .string()
    .default('10')
    .refine((data) => !isNaN(Number(data)), 'Must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'Page size must be a positive number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.'),
  email: z
    .string()
    .min(1, ' Email is required.')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  phoneNumber: z.string().refine((data) => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    try {
      const number = phoneUtil.parseAndKeepRawInput(data, '');
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      return false;
    }
  }, 'Invalid phone number'),
};
