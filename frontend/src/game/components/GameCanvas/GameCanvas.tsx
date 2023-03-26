import styles from './GameCanvas.module.css';

import cx from 'classnames';
import {
  ComponentPropsWithoutRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CountUp from 'react-countup';

import { isDefinedValue } from '../../utils';

type GameCanvasProps = {
  value?: number;
  speed?: number;
  onFinish?: () => void;
} & ComponentPropsWithoutRef<'div'>;

export const GameCanvas = memo(function GameCanvas({
  className,
  value,
  speed = 1,
  onFinish,
  ...attrs
}: GameCanvasProps) {
  const [end, setEnd] = useState(false);

  useEffect(() => {
    setEnd(false);
  }, [value]);

  const countUpOnEnd = useCallback(() => {
    setEnd(true);
    onFinish?.();
  }, [onFinish]);

  const counter = useMemo(
    () => {
      return (
        <CountUp
          key={value}
          end={value || 0}
          duration={2.5 / speed}
          decimals={2}
          suffix="x"
          onEnd={isDefinedValue(value) ? countUpOnEnd : undefined}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, countUpOnEnd],
  );

  return (
    <div
      key={value}
      className={cx(
        styles.root,
        'bg-gray-800 border-gray-700 border border-current rounded-lg p-9',
        { [styles.animate]: !!value },
        className,
      )}
      {...attrs}
      style={{ '--speed': speed } as any}
    >
      <div
        className={cx('text-6xl font-bold text-center pt-10', {
          'text-white': !end,
          'text-pink-500': !!end,
        })}
      >
        {counter}
      </div>

      <div className={styles.canvas}>
        <div className={styles.ball}></div>
        <svg
          className={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 125 85"
        >
          <path d="M1 84c39 1 82.75 1 123-83"></path>
        </svg>
      </div>
      <div
        className={cx(
          styles.x,
          'border-t border-gray-500 py-2 text-gray-500 columns-11',
        )}
      >
        {[...Array(11)].map((_, i) => (
          <div key={i} className="w-full text-center">
            {i}
          </div>
        ))}
      </div>
    </div>
  );
});
