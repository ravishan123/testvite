import { format } from 'date-fns';

/**
 * Formats the given date string or Date object.
 *
 * @function
 * @param {Date|string} date - The date to be formatted, can be a string or a Date object.
 * @param {string} [formatType='dd/MM/yyyy'] - The format in which the date should be returned. Defaults to 'dd/MM/yyyy'.
 * @returns {string} - The formatted date string.
 * @example
 * // returns "02/10/2023"
 * formatDate(new Date('2023-10-02T00:00:00'))
 * @example
 * // returns "02-10-2023"
 * formatDate('2023-10-02T00:00:00', 'dd-MM-yyyy')
 */

export const formatDate = (date: Date | string, formatType = 'dd/MM/yyyy') => {
  const formattedDate = format(new Date(date), formatType);
  return formattedDate;
};
