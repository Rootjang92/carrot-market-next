interface GithubUserInfo {
  id: number;
  avatar_url: string;
  login: string;
}

interface GithubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function getUserProfile(access_token: string): Promise<GithubUserInfo> {
  const userProfileRequest = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache', // Next.js 15 버전부터는 캐시가 되지 않음.
  });

  return await userProfileRequest.json();
}

export async function getUserEmail(access_token: string): Promise<GithubUserEmail> {
  const userEmailRequest = await fetch(`https://api.github.com/user/emails`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache', // Next.js 15 버전부터는 캐시가 되지 않음.
  });

  if (!userEmailRequest.ok) {
    throw new Error('Failed to fetch user email');
  }

  const emails = await userEmailRequest.json();

  const primaryEmail = emails.find((email: GithubUserEmail) => email.primary && email.verified);

  return primaryEmail;
}
