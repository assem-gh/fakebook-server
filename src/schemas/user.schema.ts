import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const NewUserSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: 'First Name must be at least 3 characters long' }),
  lastName: z
    .string()
    .min(3, { message: 'Last Name must be at least 3 characters long' }),
  email: z.string().email(),
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
  gender: z.enum(['male', 'female', 'other']),
});

export const LoginUserSchema = NewUserSchema.pick({
  email: true,
  password: true,
});

export type NewUser = z.infer<typeof NewUserSchema>;
