/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import db from '@/lib/database';
import getSession from '@/lib/session';

const productSchema = z.object({
  photo: z.string({
    required_error: 'Photo is required.',
  }),
  title: z.string({
    required_error: 'Title is required.',
  }),
  description: z.string({
    required_error: 'Description is required.',
  }),
  price: z.coerce.number({
    required_error: 'Price is required.',
  }),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      redirect(`/product/${product.id}`);
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    },
  );

  const data = response.json();

  return data;
}
