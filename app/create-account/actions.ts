/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import bcrypt from 'bcrypt';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import db from '@/lib/database';

const checkUserName = (username: string) => {
  return !username.includes('potato');
};

const checkPasswords = ({ password, confirm_password }: { password: string; confirm_password: string }) => {
  return password === confirm_password;
};

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({ invalid_type_error: 'Username must be a string.', required_error: 'Username required.' })
      .min(3, 'Way too short!!')
      .toLowerCase()
      .trim()
      .transform((username) => `${username}`)
      .refine((username) => checkUserName(username), 'Custom error.')
      .refine((username) => checkUniqueUsername(username), 'This username is already taken'),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine((email) => checkUniqueEmail(email), 'There is account already registered with that email.'),
    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPasswords, { message: 'Both password should be same.', path: ['confirm_password'] }); // formError

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };

  const result = await formSchema.safeParseAsync(data); // Not error throw

  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    console.log(user);
  }
}
