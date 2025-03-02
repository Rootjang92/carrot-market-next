/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { z } from 'zod';

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';

const checkUserName = (username: string) => {
  return !username.includes('potato');
};

const checkPasswords = ({ password, confirm_password }: { password: string; confirm_password: string }) => {
  return password === confirm_password;
};

const formSchema = z
  .object({
    username: z
      .string({ invalid_type_error: 'Username must be a string.', required_error: 'Username required.' })
      .min(3, 'Way too short!!')
      .toLowerCase()
      .trim()
      .transform((username) => `test ${username}`)
      .refine((username) => checkUserName(username), 'Custom error.'),
    email: z.string().email().toLowerCase(),
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

  const result = formSchema.safeParse(data); // Not error throw

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
