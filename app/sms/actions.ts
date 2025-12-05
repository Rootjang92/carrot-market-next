'use server';

import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

import db from '@/lib/database';

interface ActionState {
  token: boolean;
}

async function getToken(): Promise<string> {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  if (exists) return getToken();
  else return token;
}

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), 'Wrong phone format.');
const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsVerification(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone');
  const token = formData.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // 이전 토큰 삭제 -> 토큰 생성 -> twilio로 토큰 전송
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      const token = await getToken();

      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString('hex'),
                phone: result.data,
              },
            },
          },
        },
      });

      return { token: true };
    }
  } else {
    const result = tokenSchema.safeParse(token);

    if (!result.success) {
      return {
        token: true,
        // return the errors
        error: result.error.flatten(),
      };
    } else {
      redirect('/');
    }
  }
}
