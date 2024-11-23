/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

export async function handleForm(prevState: any, formData: FormData) {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('in the server.', formData.get('email'), formData.get('password'));
  return {
    errors: ['wrong password', 'password too short'],
  };
}
