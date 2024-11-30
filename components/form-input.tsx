interface Props {
  type: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
  name: string;
}

export default function FormInput({ type, placeholder, required, errors = [], name }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 transition focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        type={type}
        placeholder={placeholder}
        required={required}
        name={name}
      />
      {errors.map((error) => (
        <span className="text-red-500 font-medium" key={error}>
          {error}
        </span>
      ))}
    </div>
  );
}
