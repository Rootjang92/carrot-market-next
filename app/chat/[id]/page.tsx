import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';

import db from '@/lib/database';
import getSession from '@/lib/session';
import ChatMessages from '@/components/chat-messages';

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
    },
  });

  if (room) {
    const session = await getSession();
    const canSee = room.users.find((user) => user.id === session.id);
    if (!canSee) return null;
  }

  return room;
}

async function getMessage(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessage>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  const initialMessages = await getMessage(params.id);
  const session = await getSession();

  console.log(initialMessages);

  if (!room) notFound();

  return <ChatMessages initialMessages={initialMessages} userId={session.id!} />;
}
