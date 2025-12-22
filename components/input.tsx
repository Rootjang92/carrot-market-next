import { InputHTMLAttributes, ForwardedRef, forwardRef } from 'react';

interface Props {
  errors?: string[];
  name: string;
}

const Input = (
  { errors = [], name, ...props }: Props & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 transition focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        name={name}
        {...props}
        ref={ref}
      />
      {errors.map((error) => (
        <span className="text-red-500 font-medium" key={error}>
          {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(Input);
