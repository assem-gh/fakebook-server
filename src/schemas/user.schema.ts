import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const NewUserSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(3, { message: 'First Name must be at least 3 characters long' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(3, { message: 'Last Name must be at least 3 characters long' }),
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string()
    .min(6, { message: 'Password must contain at least 6 characters' }),
  birthday: z.preprocess(
    (arg) => {
      if (
        typeof arg === 'string' &&
        dayjs(arg, ['DD-MM-YYYY', 'DD/MM/YYYY', 'DD.MM.YYYY'], true).isValid()
      )
        return new Date(arg);
      return arg;
    },
    z
      .date({
        invalid_type_error:
          'The date is invalid. Please enter a date in the format : 30-11-2000.',
        required_error: 'Birthday is required ',
      })
      .refine(
        (val) => {
          return dayjs(dayjs()).diff(val, 'years', true) > 13;
        },
        { message: 'Age must be more than 13 years' }
      )
  ),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
});

export const LoginUserSchema = NewUserSchema.pick({
  email: true,
  password: true,
});

export const ForgotPasswordSchema = LoginUserSchema.pick({ email: true });

export const ResetPasswordSchema = z.object({
  newPassword: z.string({ required_error: 'Password is required' }),
  token: z.string(),
});

export type NewUser = z.infer<typeof NewUserSchema>;

export type Credentials = z.infer<typeof LoginUserSchema>;

export type ResetPayload = z.infer<typeof ResetPasswordSchema>;
