import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import getSession from '@/lib/session';
import db from '@/lib/database';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) return user;
  }

  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const user = await getUser();
  return <h1>Welcome! {user?.username}</h1>;
}

export default async function Profile() {
  const logOut = async () => {
    'use server';
    const session = await getSession();
    session.destroy();
    redirect('/');
  };

  return (
    <div>
      <Suspense fallback={'Welcome!'}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Logout</button>
      </form>
    </div>
  );
}
