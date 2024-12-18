'use client';

import { useFormState } from 'react-dom';

import Input from '@/components/input';
import Button from '@/components/button';

import { smsVerification } from './actions';

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsVerification, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input type="text" name="phone" placeholder="Phone number" required errors={state.error?.formErrors} />
        {state.token && (
          <Input
            type="number"
            name="token"
            placeholder="Verification code"
            required
            min={100000}
            max={999999}
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? 'Verify Token' : 'Send Verification SMS.'} />
      </form>
    </div>
  );
}
