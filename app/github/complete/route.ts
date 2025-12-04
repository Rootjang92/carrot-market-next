import { NextRequest } from 'next/server';
import { notFound } from 'next/navigation';

import db from '@/lib/database';
import login from '@/lib/login';
import { getAccessToken } from '@/utils/getAccessToken';
import { getUserEmail, getUserProfile } from '@/utils/getGithubUserInfo';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return notFound();
  }

  const { error, access_token } = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login: username } = await getUserProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      githubId: id + '',
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await login(user);
  }

  const { email } = await getUserEmail(access_token);

  const existsUserEmail = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  const newUser = await db.user.create({
    data: {
      githubId: id + '',
      username: existsUserEmail ? `${username}@github` : username,
      avatar: avatar_url,
      email: existsUserEmail ? null : email,
    },
    select: {
      id: true,
    },
  });

  await login(newUser);
}
