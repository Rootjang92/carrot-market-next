'use server';
import { revalidateTag } from 'next/cache';

import db from '@/lib/database';
import getSession from '@/lib/session';

export async function likePost(postId: number) {
  // await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();

  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function disLikePost(postId: number) {
  // await new Promise((r) => setTimeout(r, 10000));

  const session = await getSession();

  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function createComment(payload: string, postId: number) {
  const user = await getSession();

  if (!user.id) return;

  const newComment = await db.comment.create({
    data: {
      userId: user.id,
      payload,
      postId: postId,
    },
  });

  revalidateTag(`comments-${postId}`);
  return newComment;
}

export async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
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

  return comments;
}
