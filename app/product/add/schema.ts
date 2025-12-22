import { z } from 'zod';

export const productSchema = z.object({
  photo: z.string({ message: 'Photo is required.' }),
  title: z.string({ message: 'Title is required.' }),
  description: z.string({ message: 'Description is required.' }),
  price: z.number({ message: 'Price is required.' }),
});

export type ProductType = z.infer<typeof productSchema>;
