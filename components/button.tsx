'use client';

import { useFormStatus } from 'react-dom';

interface Props {
  text: string;
}

export default function Button({ text }: Props) {
  // interactive 하기 때문에 client component에서 사용 가능
  const { pending } = useFormStatus(); // action을 사용하는 곳에서 같이 사용할 수 없음. -> 자식 요소에서만 사용 가능.

  return (
    <button
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? '로딩 중' : text}
    </button>
  );
}
