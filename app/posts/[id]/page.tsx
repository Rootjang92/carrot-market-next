import { notFound } from 'next/navigation';
import Image from 'next/image';
import { EyeIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache } from 'next/cache';

import db from '@/lib/database';
import { formatToTimeAgo } from '@/lib/utils';
import getSession from '@/lib/session';
import { getComments } from './actions';

import LikeButton from '@/components/like-button';
import { CommentList } from '@/components/comment-list';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const cachedPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
  revalidate: 60,
});

const getCachedComments = (postId: number) => {
  const cachedComments = nextCache(getComments, ['comments'], {
    tags: [`comments-${postId}`],
  });

  return cachedComments(postId);
};

async function getMe() {
  const session = await getSession();
  const user = session.id
    ? await db.user.findUnique({
        where: {
          id: session.id,
        },
        select: {
          id: true,
          avatar: true,
          username: true,
        },
      })
    : null;

  return user;
}

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return { likeCount, isLiked: Boolean(isLiked) };
}

const getCachedLikeStatus = (postId: number, userId: number) => {
  const cachedOperation = nextCache(getLikeStatus, ['like-status'], {
    tags: [`like-status-${postId}`],
  });

  return cachedOperation(postId, userId);
};

export default async function PostDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) return notFound();

  const post = await cachedPost(id);

  if (!post) return notFound();

  const session = await getSession();

  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);

  const allComments = await getCachedComments(post.id);

  const user = await getMe();

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-center">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <CommentList postId={post.id} allComments={allComments} user={user} />
    </div>
  );
}
