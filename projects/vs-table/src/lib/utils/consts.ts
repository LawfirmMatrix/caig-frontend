export const formatAccounting = (value: string | null) => {
  if (value && value.charAt(0) === '-') {
    return `(${value.substr(1)})`;
  }
  return value;
}
