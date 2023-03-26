export const isDefinedValue = <T>(value: T): value is NonNullable<T> => {
  return value !== undefined && value !== null;
};

export const randomInt = (min: number, max: number) =>
  roundNumber(min + Math.random() * (max - min));

export const roundNumber = (value: number) => Number(value.toFixed(2));
