import z from 'zod';

export const apiSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  status: z.number().int(),
  data: z.unknown(),
  timestamp: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ApiSuccessResponse<T> = Omit<z.infer<typeof apiSuccessResponseSchema>, 'data'> & {
  data: T;
};

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  status: z.number(),
  timestamp: z.coerce.date(),
  path: z.string(),
  error: z.unknown().optional(), // ? not quite my tempo
});

export const showBrowserNotification = (): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('notification.title', {
      body: 'notification.message',
      icon: 'assets/images/kayan.png', // Your app icon
    });
  }
};

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
