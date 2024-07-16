export const isUnique = <T, K extends keyof T>(
  value: T[K],
  key: K,
  list: Array<T>
): boolean => {
  return !list.find((item) => {
    return value === item[key];
  });
};

export const hasEnoughLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  return value.length >= min && value.length <= max;
};

export const isAfterDate = (value: Date, after: Date): boolean => {
  return value >= after;
};

export const matchRegex = (value: string, regex: RegExp): boolean => {
  return regex.test(value);
};
