import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import { object, date, number, string, boolean, array, z, intersection } from 'zod';

import { OTHER_ORG_TYPE } from '@globals/orgAutoComplete';

/*
  This is a workaround for replacing default error message for activity location and date
  errorMap on specific schema object did not trigger custom error
*/

z.setErrorMap((issue, ctx) => {
  if (issue.path[0] === 'activityLocation') {
    return { message: 'Volunteering location is required to verify your volunteer hours' };
  }

  if (issue.path[0] === 'date') {
    return {
      message:
        'Volunteer Organization would require specific date or date range to identify your commitments for approve your request',
    };
  }

  return { message: ctx.defaultError };
});

const organizationSchema = object({
  organization: object(
    {
      name: string()
        .nonempty({ message: 'Organization name is required' })
        .max(100, { message: 'Maximum 100 Characters allowed' }),
      id: string(),
      value: string(),
      logo: string(),
      orgtype: string(),
    },
    {
      errorMap: () => ({ message: 'Organization name is required' }),
    }
  ).optional(),
  coordinator: object({
    email: string()
      .email({ message: 'We require a valid email address to send your request to verify your volunteer hours' })
      .optional()
      .or(z.literal('')),
    name: string()
      .nonempty({ message: "Coordinator's name can't be empty" })
      .max(100, { message: 'Maximum 100 Characters allowed' }),
  }).optional(),
}).superRefine(({ coordinator, organization }, ctx) => {
  if (organization?.value === OTHER_ORG_TYPE && !coordinator?.email) {
    ctx.addIssue({
      code: 'custom',
      message: 'We need a contact email address to send your request to verify your volunteer hours',
      path: ['coordinator', 'email'],
    });
  }
});

const hourInfoSchema = object({
  date: object({
    startDate: date(),
    endDate: date(),
  }).superRefine(({ startDate, endDate }, ctx) => {
    if (startDate && endDate) {
      if (!(isBefore(startDate, endDate) || isEqual(startDate, endDate))) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start date must be before end date',
          path: ['date'],
        });
      }
    }
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
    { message: 'Number of volunteer hours is required to submit your volunteer hours for verification' }
  ),
  activityDescription: string()
    .nonempty({ message: 'It’s important to have your volunteer activity description to get your hours verified' })
    .max(2000, { message: 'Description must be less than 2000 characters' }),

  skills: string()
    .or(object({ id: string(), name: string() }))
    .array()
    .max(10, { message: 'Maximum 10 skills allowed' })
    .optional()
    .superRefine((val, ctx) => {
      const skills = val && val.map((skill) => (typeof skill === 'string' ? skill.trim() : skill.name.trim()));
      if (skills && skills.length !== new Set(skills).size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please remove any duplicate skills`,
        });
      }
    }),
  causes: array(string()).nonempty({
    message: 'Select at least one cause',
  }),
  unsdgs: array(string()),
}).superRefine(({ date, duration }, ctx) => {
  // Check if both startDate and endDate are present
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
});

const activitySchema = object({
  isRemote: boolean().nullable(),
  activityLocation: object({
    address1: string().optional(),
    address2: string().optional(),
    postalCode: string().optional(),
    city: string().optional(),
    state: string().optional(),
    country: string().optional(),
  }).nullable(),
}).superRefine(({ isRemote, activityLocation }, ctx) => {
  if (!isRemote && !activityLocation?.country) {
    ctx.addIssue({
      code: 'custom',
      message: 'Volunteering location is required to verify your volunteer hours',
      path: ['activityLocation'],
    });
  }
});

export const addHoursFormSchema = intersection(activitySchema, intersection(organizationSchema, hourInfoSchema));
