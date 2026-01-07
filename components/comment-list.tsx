'use client';

import { useOptimistic, useRef } from 'react';
import Image from 'next/image';

import { createComment } from '@/app/posts/[id]/actions';
import { formatToTimeAgo } from '@/lib/utils';
import { Addcomment } from './add-comment';

type Comment = {
  user: {
    avatar: string | null;
    username: string;
  };
  id: number;
  payload: string;
  user_id?: number;
  post_id?: number;
  created_at: Date | string;
  updated_at: Date | string;
};

interface Props {
  allComments: Comment[];
  postId: number;
  user: { avatar: string | null; username: string; id: number } | null;
}

export function CommentList({ allComments, postId, user }: Props) {
  const commentEndRef = useRef<HTMLDivElement>(null);
  const [optimisticComments, addOptimisticComment] = useOptimistic(allComments, (state: Comment[], newComment: Comment) => {
    return [...state, newComment];
  });

  const handleSubmit = async (payload: string, postId: number) => {
    if (!user) return;

    addOptimisticComment({
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: optimisticComments.length + 1,
      payload,
      post_id: postId,
      user: {
        username: user.username,
        avatar: user.avatar,
      },
    });

    if (commentEndRef.current) commentEndRef.current.scrollIntoView({ behavior: 'smooth' });
    await createComment(payload, postId);
  };

  return (
    <div className="mt-10 border-t border-neutral-700 pt-6">
      <h3 className="text-base font-semibold mb-5">댓글 {optimisticComments.length}</h3>
      <div className="flex flex-col gap-5 mb-20">
        {optimisticComments.map((comment) => (
          <div className="flex gap-3" key={comment.id}>
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={comment.user.avatar!}
              alt={comment.user.username}
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold">{comment.user.username}</span>
                <span className="text-xs text-neutral-500">{formatToTimeAgo(comment.created_at.toString())}</span>
              </div>
              <p className="text-sm">{comment.payload}</p>
            </div>
          </div>
        ))}
        <div ref={commentEndRef} />
      </div>
      <Addcomment postId={postId} handleSubmit={handleSubmit} user={user} />
    </div>
  );
}
