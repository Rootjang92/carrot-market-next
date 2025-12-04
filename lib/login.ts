import { redirect } from 'next/navigation';
import getSession from './session';

type User = { id: number } | null;

export default async function login(user: User) {
  const session = await getSession();
  session.id = user?.id;
  await session.save();
  return redirect('/profile');
}
