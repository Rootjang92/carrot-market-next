import { notFound } from 'next/navigation';
import { unstable_cache as nextCache } from 'next/cache';
import EditProductForm from '@/components/edit-product';
import db from '@/lib/database';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail', 'product'],
});

export default async function EditProduct({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const product = await getCachedProduct(id);
  if (product === null) return notFound();

  return (
    <EditProductForm
      photo={product.photo}
      title={product.title}
      price={product.price}
      description={product.description}
    />
  );
}
