import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import { object, date, number, string, boolean, array } from 'zod';

export const amendHoursFormSchema = object({
  date: object({
    startDate: date(),
    endDate: date(),
  }).refine(({ startDate, endDate }) => isBefore(startDate, endDate) || isEqual(startDate, endDate), {
    message: 'Start date must be before end date',
  }),
  duration: object({
    hours: number(),
    minutes: number(),
  }).refine(
    ({ hours, minutes }) => {
      // Check if there is at least 1 hour or 1 minute
      if (hours === 0 && minutes === 0) return false;

      return true;
    },
    { message: 'Duration must be greater than 0' }
  ),
  activityDescription: string()
    .nonempty({ message: "It's important to have your volunteer activity description to get your hours verified" })
    .max(2000, { message: 'Description must be less than 2000 characters' }),
  isRemote: boolean(),
  activityLocation: object({
    address1: string(),
    address2: string(),
    postalCode: string(),
    city: string(),
    state: string(),
    country: string(),
  }).partial(),
  skills: string()
    .or(object({ id: string(), name: string() }))
    .array()
    .optional(),
  causes: array(string()).nonempty({
    message: 'Select at least one cause',
  }),
  unsdgs: array(string()),
  amendedReason: string()
    .nonempty({ message: 'Amend reason is required' })
    .max(250, { message: 'Amend reason must be less than 250 characters' }),
}).superRefine(({ date, duration, isRemote, activityLocation }, ctx) => {
  if (date.startDate && date.endDate && duration) {
    const startDate = startOfDay(date.startDate); // Get the start of the day for startDate
    const endDate = endOfDay(date.endDate); // Get the end of the day for endDate

    const differenceInMillis = differenceInMilliseconds(endDate, startDate); // Calculate the difference in milliseconds between endDate and startDate
    let diffDateRangeInMinutes = differenceInMillis / (1000 * 60); // Convert the difference to minutes

    const DiffCeilHours = Math.ceil(diffDateRangeInMinutes); // Round up the difference to the nearest hour

    const durationInMinutes = duration.hours * 60 + duration.minutes; // Calculate the total duration in minutes

    diffDateRangeInMinutes = durationInMinutes === DiffCeilHours ? DiffCeilHours : diffDateRangeInMinutes; // If the duration matches the rounded up difference, use the rounded up difference as the final duration

    // Check if the final duration is greater than the calculated duration
    if (diffDateRangeInMinutes < durationInMinutes) {
      ctx.addIssue({
        code: 'custom',
        message: "The volunteer hours you are claiming doesn't fit into your selected time period",
        path: ['duration'],
      });
    }
  }

  if (!isRemote && !activityLocation.country) {
    ctx.addIssue({
      code: 'custom',
      message: 'Activity location is required',
      path: ['activityLocation'],
    });
  }
});
