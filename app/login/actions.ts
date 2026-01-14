/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import db from '@/lib/database';
import login from '@/lib/login';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, 'An account with this email does no exist.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // find a user with the email.
    // 유저를 찾았을 때만 패스워드 해시 체크 -> 로그인 -> profile 페이지로 redirect
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const isPasswordCorrect = await bcrypt.compare(result.data.password, user!.password ?? 'xxxx');

    if (isPasswordCorrect) {
      await login(user);
    } else {
      return {
        fieldErrors: {
          password: ['Password is incorrect.'],
          email: [],
        },
      };
    }
  }
}
