import { NextRequest } from 'next/server';
import { notFound } from 'next/navigation';

import db from '@/lib/database';
import login from '@/lib/login';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return notFound();
  }

  const accessTokenParmas = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParmas}`;

  const response = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  const { error, access_token } = await response.json();

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const userProfileRequest = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache', // Next.js 15 버전부터는 캐시가 되지 않음.
  });

  const { id, avatar_url, login: username } = await userProfileRequest.json();

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

  const newUser = await db.user.create({
    data: {
      githubId: id + '',
      username,
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  await login(newUser);
}
