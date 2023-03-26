import cx from 'classnames';
import { ComponentPropsWithoutRef, memo } from 'react';

type ButtonProps = {
  userId?: string;
} & ComponentPropsWithoutRef<'button'>;

export const Button = memo(function Button({
  className,
  userId,
  children,
  disabled,
  ...attrs
}: ButtonProps) {
  return (
    <button
      className={cx(
        'block h-12 w-full text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline font-semibold text-lg',
        {
          'bg-gray-400': disabled,
          'bg-gradient-to-r  from-pink-500 to-orange-500': !disabled,
        },
        className,
      )}
      type="button"
      disabled={disabled}
      {...attrs}
    >
      {children}
    </button>
  );
});
