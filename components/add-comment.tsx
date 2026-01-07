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
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 px-5 py-3">
      <form className="flex gap-3 items-center max-w-screen-sm mx-auto" onSubmit={onSubmit}>
        <input
          placeholder={user ? '댓글을 입력하세요' : '로그인이 필요합니다'}
          className="flex-1 bg-neutral-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          name="payload"
          disabled={!user}
        />
        {user && (
          <button
            className="text-orange-500 hover:text-orange-400 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors"
            type="submit"
            disabled={loading}
          >
            <PaperAirplaneIcon className="size-6" />
          </button>
        )}
      </form>
    </div>
  );
}
