'use client';
import { useOptimistic, useTransition } from 'react';

import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';

import { likePost, disLikePost } from '@/app/posts/[id]/actions';

interface Props {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({ isLiked, likeCount, postId }: Props) {
  const [state, reducer] = useOptimistic({ isLiked, likeCount }, (prev) => ({
    isLiked: !prev.isLiked,
    likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
  }));
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    startTransition(async () => {
      reducer(undefined);

      if (isLiked) {
        await disLikePost(postId);
      } else {
        await likePost(postId);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors ${state.isLiked ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-neutral-800 '} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {state.isLiked ? <HandThumbUpIcon className="size-5" /> : <OutlineHandThumbUpIcon className="size-5" />}
      {state.isLiked ? <span>({state.likeCount})</span> : <span>공감하기 ({state.likeCount})</span>}
    </button>
  );
}
