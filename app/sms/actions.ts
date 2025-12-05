'use server';

import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import twilio from 'twilio';

import db from '@/lib/database';
import getSession from '@/lib/session';

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

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
}

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), 'Wrong phone format.');
const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, 'This token does not exist.');

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

      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      await client.messages.create({
        body: `Your Karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!, // 원래는 result.data 지만 유료이기 때문에 작성자 번호로
      });

      return { token: true };
    }
  } else {
    const result = await tokenSchema.spa(token);

    if (!result.success) {
      return {
        token: true,
        // return the errors
        error: result.error.flatten(),
      };
    } else {
      // userId 얻기
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      // 로그인
      redirect('/profile');
    }
  }
}
