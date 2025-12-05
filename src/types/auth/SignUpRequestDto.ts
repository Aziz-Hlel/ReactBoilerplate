import z from 'zod';

export const singUpSchema = z
  .object({
    email: z.email({ message: 'Invalid email' }).trim().max(255, { message: 'Email is too long, max 255 characters' }),
    password: z
      .string({ error: 'Invalid password' })
      .trim()
      .min(8, { message: 'Password is too short, min 8 characters' })
      .max(50, { message: 'Password is too long, max 50 characters' }),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const firebaseSingUpSchema = z.object({
  idToken: z
    .string({ message: 'Invalid idToken' })
    .trim()
    .max(255, { message: 'Email is too long, max 255 characters' }),
});

export type SignUpRequestSchema = z.infer<typeof singUpSchema>;
export type FirebaseSignUpRequestSchema = z.infer<typeof firebaseSingUpSchema>;
export type SignUpRequestDto = Omit<SignUpRequestSchema, 'confirmPassword'>;
