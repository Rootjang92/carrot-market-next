'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

import { InitialChatMessages } from '@/app/chat/[id]/page';
import { formatToTimeAgo } from '@/lib/utils';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

interface Props {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
}

const SUPABASE_PUBLIC_KEY = `sb_publishable_x5mgohIUDRMzrnHUdP0KaA_2W4SlKCB`;
const SUPABASE_URL = `https://rjmrjqhemnxjuvefctai.supabase.co`;

export default function ChatMessages({ initialMessages, userId, chatRoomId }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');

  const channel = useRef<RealtimeChannel>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: 'test',
          avatar: 'xxx',
        },
      },
    ]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: { message },
    });
    setMessage('');
  };

  // http://localhost:3000/chat/cmk657fx00001nrb9ju28a0k4
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log(payload);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-2 items-start ${message.userId === userId ? 'justify-end' : ''}`}>
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div className={`flex flex-col gap-1 ${message.userId === userId ? 'items-end' : ''}`}>
            <span className={`${message.userId === userId ? 'bg-neutral-500' : 'bg-orange-500'} p-2.5 rounded-md`}>
              {message.payload}
            </span>
            <span className="text-xs">{formatToTimeAgo(message.created_at.toString())}</span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={handleSubmit}>
        <input
          required
          onChange={handleChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
