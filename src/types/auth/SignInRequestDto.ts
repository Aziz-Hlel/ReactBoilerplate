import z from 'zod';

export const singInSchema = z.object({
  email: z
    .email({ message: 'Invalid email' })
    .trim()
    .max(255, { message: 'Email is too long, max 255 characters' }),
  password: z
    .string({ error: 'Invalid password' })
    .trim()
    .min(8, { message: 'Password is too short, min 8 characters' }),
});

export type SignInRequestDto = z.infer<typeof singInSchema>;

export const firebaseSignInSchema = z.object({
  idToken: z
    .string({ message: 'Invalid idToken' })
    .trim()
    .max(255, { message: 'Email is too long, max 255 characters' }),
});

export type FirebaseSignInRequestDto = z.infer<typeof firebaseSignInSchema>;
