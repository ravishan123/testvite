import { object, string, date } from 'zod';
import differenceInYears from 'date-fns/differenceInYears';

const namePattern = /^[A-Za-z\s]+$/;

const formSchema = object({
  firstName: string()
    .nonempty({ message: 'First name is required' })
    .max(30, 'Maximum character limit is 30')
    .refine((value) => namePattern.test(value), {
      message: 'First name can only contain alphabetic characters and spaces',
    }),
  lastName: string()
    .nonempty({ message: 'Last name is required' })
    .max(30, 'Maximum character limit is 30')
    .refine((value) => namePattern.test(value), {
      message: 'Last name can only contain alphabetic characters and spaces',
    }),
  dateOfBirth: date({
    required_error: 'Please enter the DOB to continue',
    invalid_type_error: 'Please enter the DOB to continue',
  }).refine((date) => differenceInYears(new Date(), date) >= 13, {
    message: `Minimum age should be 13 years or older `,
  }),
  gender: string().max(30, 'Maximum character limit is 30').nullish(),
  joinedDate: date().nullish(),
});

export default formSchema;
