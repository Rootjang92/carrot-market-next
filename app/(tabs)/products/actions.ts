'use server';

import db from '@/lib/database';

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: page,
    skip: 1,
    orderBy: {
      created_at: 'desc',
    },
  });

  return products;
}
