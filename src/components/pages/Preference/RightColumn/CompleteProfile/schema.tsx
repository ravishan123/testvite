import { object, string, union } from 'zod';
import { findPhoneNumbersInText, isValidPhoneNumber } from 'libphonenumber-js';

// .regex(new RegExp('^[\\w\\s\\d.,!?\'"()/-]*$'), 'Only alphanumeric characters are allowed')

const formSchema = object({
  location: object({
    country: union([string().nullable(), string().min(2).max(2)]),
    city: string().max(100).nullable(),
  }).refine(
    (value) => {
      if (value) {
        return value.country ? !!value.city : true;
      }

      return true;
    },
    {
      message: 'Please select country and city',
    }
  ),
  phone: string()
    .refine(
      (value) => {
        const phoneNumber = findPhoneNumbersInText(value);
        if (phoneNumber.length === 1) {
          return isValidPhoneNumber(phoneNumber[0].number.number);
        }
        return false;
      },
      {
        message: 'Please enter valid phone number',
      }
    )
    .nullable(),
  about: string()
    .max(2000, { message: 'Maximum 2000 characters allowed' })
    .regex(
      new RegExp('^[\\w\\s\\d.,!?\'"()/-]*$'),
      'Only alphanumeric characters and certain punctuation marks are allowed'
    )
    .nullable(),
});

export default formSchema;
