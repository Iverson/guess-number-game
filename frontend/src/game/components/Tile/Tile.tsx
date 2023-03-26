import cx from 'classnames';
import { ComponentPropsWithoutRef, memo } from 'react';

type TileProps = ComponentPropsWithoutRef<'div'>;

export const Tile = memo(function Tile({ className, ...attrs }: TileProps) {
  return (
    <div
      className={cx(
        'h-12 py-2 px-4 rounded-lg border-gray-800 border bg-gradient-to-r from-gray-900 to-gray-800 text-white text-lg font-semibold text-center flex items-center',
        className,
      )}
      {...attrs}
    ></div>
  );
});
