import { z } from 'zod';

const UserSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  birthday: z.date(),
  gender: z.enum(['male', 'female', 'other']),
});

const LoginUserSchema = UserSchema.pick({ email: true, password: true });

export default { UserSchema, LoginUserSchema };
