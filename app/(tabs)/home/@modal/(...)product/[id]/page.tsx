// parallel route로 intercept route를 활용.
// intercept 후 intercept한 route를 parellel하게 보여줌.
import { notFound } from 'next/navigation';
import Image from 'next/image';
import db from '@/lib/database';

import ModalCloseButton from '@/components/modal-close-btn';

export default async function Modal({ params }: { params: { id: string } }) {
  const id = +params.id;

  if (isNaN(id)) return notFound();

  const product = await db.product.findUnique({
    where: {
      id: id,
    },
    select: {
      photo: true,
      title: true,
    },
  });

  if (!product) return notFound();

  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <ModalCloseButton />
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
        <div className="relative flex items-center justify-center overflow-hidden rounded-md aspect-square bg-neutral-700 text-neutral-200">
          <Image src={`${product.photo}/public`} alt={product.title} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
