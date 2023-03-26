import styles from './NumberControl.module.css';
import cx from 'classnames';
import { ComponentPropsWithoutRef, memo, ReactNode } from 'react';
import { InputGroup, InputNumber } from 'rsuite';
import { isDefinedValue } from '../../utils';

type NumberControlProps = {
  label: ReactNode;
  value: number;
  fractionDigits?: number;
  step?: number;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'onChange'>;

export const NumberControl = memo(function NumberControl({
  className,
  label,
  value,
  max,
  min,
  fractionDigits = 0,
  step = 1,
  onChange,
  ...attrs
}: NumberControlProps) {
  if (isDefinedValue(min) && isDefinedValue(max)) {
    min = Math.min(min, max);
  }

  return (
    <div
      className={cx(
        'rounded-lg border-gray-800 border bg-gradient-to-r from-gray-900 to-gray-800 px-4 pb-1',
        className,
      )}
      {...attrs}
    >
      <div className="text-center text-gray-500 text-xs font-semibold">
        {label}
      </div>

      <InputGroup
        size="xs"
        className={cx('border-gray-700', styles.inputGroup)}
      >
        <InputGroup.Button
          size="xs"
          onClick={() =>
            (!isDefinedValue(min) || value - step >= min) &&
            onChange(value - step)
          }
        >
          -
        </InputGroup.Button>
        <InputNumber
          size="xs"
          className={cx('bg-zinc-900 ', styles.input)}
          value={value.toFixed(fractionDigits)}
          min={min}
          max={max}
          onChange={(v) => onChange(Number(v))}
          buttonAppearance="subtle"
        />
        <InputGroup.Button
          size="xs"
          onClick={() =>
            (!isDefinedValue(max) || value + step <= max) &&
            onChange(value + step)
          }
        >
          +
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
});
