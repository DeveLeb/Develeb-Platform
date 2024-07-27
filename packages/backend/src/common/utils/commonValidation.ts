import { z } from 'zod';

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'ID must be a positive number'),
  // ... other common validations
};
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;

  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long.` };
  }
  if (!hasNumber.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!hasSpecialChar.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }
  if (!hasUpperCase.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!hasLowerCase.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }

  return { valid: true };
};
