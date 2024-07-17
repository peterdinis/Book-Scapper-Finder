import { z } from 'zod';

export const schema = z.object({
    bookName: z.string().min(1, 'Book name is required'),
});

export type BookFormData = z.infer<typeof schema>;
