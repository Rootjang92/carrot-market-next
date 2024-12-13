'use client';

import { useFormState } from 'react-dom';

import FormInput from '@/components/input';
import FormButton from '@/components/button';
import SocialLogin from '@/components/social-login';

import { handleForm } from './actions';

export default function Login() {
  const [state, action] = useFormState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput type="email" name="email" placeholder="Email" required />
        <FormInput type="password" name="password" placeholder="Password" required />
        <FormButton text="Login" />
      </form>
      <SocialLogin />
    </div>
  );
}
