/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { redirect } from 'next/navigation';

import db from '@/lib/database';
import getSession from '@/lib/session';
import { productSchema } from './schema';

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
  };

  const result = productSchema.safeParse(data);

  console.log(result);

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

      redirect(`/products/${product.id}`);
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

  const data = await response.json();

  return data;
}
