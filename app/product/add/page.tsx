/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/button';
import Input from '@/components/input';

import { uploadProduct, getUploadUrl } from './actions';
import { productSchema, ProductType } from './schema';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue('photo', `https://imagedelivery.net/I0v6_EolNk-mYej4G4ricg/${id}`);
    }
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) return;

    const cloudflareForm = new FormData();

    cloudflareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudflareForm,
    });

    if (response.status !== 200) return;

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price + '');
    formData.append('description', data.description);
    formData.append('photo', data.photo);

    const errors = await uploadProduct(formData);

    if (errors) {
      // setError('');
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">사진을 추가해주세요. {errors.photo?.message}</div>
            </>
          ) : null}
        </label>
        <input onChange={onImageChange} type="file" id="photo" name="photo" accept="image/*" className="hidden" />
        <Input required placeholder="제목" type="text" errors={[errors.title?.message ?? '']} {...register('title')} />
        <Input
          type="number"
          required
          placeholder="가격"
          errors={[errors.price?.message ?? '']}
          {...register('price', { valueAsNumber: true })}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          errors={[errors.description?.message ?? '']}
          {...register('description')}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
