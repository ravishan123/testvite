export function formatNumberWithCommas(input: string): string {
  const number = parseInt(input);

  if (isNaN(number)) {
    throw new Error('Invalid input: Not a number');
  }

  return number.toLocaleString();
}
