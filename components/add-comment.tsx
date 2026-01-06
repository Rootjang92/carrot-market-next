'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { FormEvent, useState } from 'react';

interface Props {
  postId: number;
  handleSubmit: (payload: string, postId: number) => Promise<void>;
  user: { id: number; avatar: string | null; username: string } | null;
}

export function Addcomment({ postId, handleSubmit, user }: Props) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = formData.get('payload') as string;
    await handleSubmit(payload, postId);
    setLoading(false);
  };

  return (
    <div className="w-full h-16 absolute bottom-0 px-5 border-t border-neutral-600">
      <form className="flex space-x-4 justify-around items-center size-full" onSubmit={onSubmit}>
        <input
          placeholder={user ? '댓글 입력하기.' : '로그인 해주세요.'}
          className="w-11/12 h-12 bg-transparent rounded-full focus:outline-none outline-offset-2"
          name="payload"
          disabled={!user}
        />
        {user && (
          <button
            className="text-orange-500 hover:text-orange-400 active:text-orange-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:animate-pulse"
            type="submit"
            disabled={loading}
          >
            <PaperAirplaneIcon className="size-8" />
          </button>
        )}
      </form>
    </div>
  );
}
