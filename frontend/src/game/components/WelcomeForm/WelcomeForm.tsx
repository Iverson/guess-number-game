import cx from 'classnames';
import {
  ComponentPropsWithoutRef,
  memo,
  SyntheticEvent,
  useState,
} from 'react';

type WelcomeFormProps = {
  compact?: boolean;
  loading?: boolean;
  onSubmit: (name: string) => void;
} & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>;

export const WelcomeForm = memo(function WelcomeForm({
  className,
  onSubmit,
  loading,
  compact = false,
  ...attrs
}: WelcomeFormProps) {
  const [name, setName] = useState<string>('');
  const valid = !!name;

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form
      className="min-h-full bg-gray-800 border-gray-700 border border-current rounded-lg px-8 pt-6 pb-28 flex flex-col justify-center"
      {...attrs}
      onSubmit={submitHandler}
    >
      <div className="mb-2 text-center">
        <h2 className="text-2xl text-gray-400 mb-20">Welcome</h2>

        <label
          className="block text-gray-500 text-xs font-bold mb-4"
          htmlFor="name"
        >
          Please Enter your Name
        </label>
        <input
          className="form-input h-11 dark:bg-zinc-900 appearance-none border rounded-md w-full py-2 px-4 text-white leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={name}
          id="name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className={cx(
            'block h-11 w-full  text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline',
            {
              'bg-gray-400': !valid,
              'bg-gradient-to-r  from-pink-500 to-orange-500': valid,
            },
          )}
          type="submit"
          disabled={!valid}
        >
          Accept
        </button>
      </div>
    </form>
  );
});
