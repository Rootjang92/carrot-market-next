import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import db from '@/lib/database';
import ProductList from '@/components/product-list';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });

  return products;
}

// const getCachedProducts = nextCache(getInitialProducts, ['home-products']);
export const dynamic = 'force-dynamic';

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export const metadata = {
  title: 'Home',
};

export const revalidate = 60;

export default async function Chat() {
  const initialProduct = await getInitialProducts();

  const revalidate = async () => {
    'use server';
    revalidatePath('/home');
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <Link href="/home/recent">Recent products</Link>
      <form action={revalidate}>
        <button>Revalidation</button>
      </form>
      <ProductList initialProducts={initialProduct} />

      <Link
        href={'/products/add'}
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
