import { z } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';

import { getCountryCodeByDialCode } from '@utils/data/countries.data';

import { organizationApiSlice } from '@store/slices/organization/organization.slice';
import { store } from '@store/store';

import { stripPhoneNo } from '@utils/functions/countryAndPhoneUtils';

const urlRegex = new RegExp(
  '^((http|https)://)[-a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$'
);

export const getStepOneSchema = (orgId: string) =>
  z
    .object({
      organizationName: z
        .string()
        .nonempty({ message: 'Organization name is required' })
        .max(100, { message: 'Maximum 100 Characters allowed' })
        .refine(
          (organizationName) => {
            const regex = /(^\s+$)|(^\s+\S)|(\S\s+$)/;
            const hasWhiteSpace = regex.test(organizationName.trim());

            if (hasWhiteSpace) {
              return false;
            }

            return true;
          },
          {
            message: 'Organization name is required',
          }
        )
        .refine(
          /**
           * Checks if the organization name already exists in the the database.
           **/
          (organizationName) => {
            /**
             * RTKQ will add an entry to the state object, such as fetchOrgList("My organization")`, `fetchOrgList("") etc.
             * The `select` method will return the cached data for the given query arg, if it exists. This can be a bit confusing
             * because the `select` method is not a selector in the Redux sense. It is a method on the RTKQ API slice that returns
             * a selector that can be used to access the cached data for a given query arg.
             *
             * - https://redux-toolkit.js.org/rtk-query/usage/usage-without-react-hooks#accessing-cached-data--request-status
             * - https://redux-toolkit.js.org/rtk-query/api/created-api/endpoints#select
             **/

            const { data: result = [] } = organizationApiSlice.endpoints.fetchOrgList.select(undefined)(
              store.getState()
            );
            const { data: orgDetails } = organizationApiSlice.endpoints.getOrganizationsEdit.select({
              orgId: orgId,
              contextType: 'edit',
            })(store.getState());

            const filteredList = result.filter((obj) => obj.id !== orgDetails?.id);

            if (filteredList.some((org) => org.name?.toLowerCase() === organizationName?.toLowerCase())) {
              return false;
            }

            return true;
          },
          {
            message: 'Organization name already exists',
          }
        ),
      organizationType: z.string().nonempty({ message: 'Type of organization is required' }),
      organizationTypeOther: z.string().max(300, { message: 'Maximum 300 Characters allowed' }),
      isSocialEnterprise: z.string().nonempty({
        message: 'Social enterprise is required',
      }),
    })

    .refine(
      /**
       * Checks if the organization type is "Other" and if so,
       * checks if the organizationTypeOther field is empty. In RTK query,
       * the api result has been transformed to have an additional type to represent
       * the "Other" option with a value of "0".
       **/
      (formFields) => {
        if (formFields.organizationType === '0' && formFields.organizationTypeOther === '') {
          return false;
        }

        return true;
      },
      {
        message: 'Type of organization is required',
        path: ['organizationTypeOther'],
      }
    );

export const stepTwoSchema = z.object({
  organizationDescription: z
    .string()
    .nonempty({ message: 'Organization description is required' })
    .max(5000, { message: 'Maximum 5000 Characters allowed' }),
  phoneNumber: z
    .string()
    .nonempty({ message: 'Phone number is required' })
    .refine(
      (value) => {
        if (value) {
          const { code, number } = stripPhoneNo(value);
          if (!code) return false;
          const countryCode = getCountryCodeByDialCode(code);
          if (!countryCode) return false;
          const phoneNumber = parsePhoneNumber(number, countryCode as CountryCode);
          return !!number && !!code && phoneNumber?.isValid();
        }
        return true;
      },
      {
        message: 'Please enter a valid mobile number',
      }
    ),
  location: z
    .object({
      city: z.string(),
      country: z.string(),
    })
    .refine(
      (val) => {
        if (val.city === '' || val.country === '') return false;
        return true;
      },
      { message: 'City and Country are required' }
    ),
});

export const stepThreeSchema = z.object({
  website: z
    .string()
    .max(500, { message: 'Maximum 500 Characters allowed' })
    .refine(
      (val) => {
        if (val === '') return true;

        return urlRegex.test(val);
      },
      { message: 'Please enter a valid URL' }
    ),
  profileInformation: z
    .string()
    .max(500, { message: 'Maximum 500 Characters allowed' })
    .refine(
      (val) => {
        if (val === '') return true;

        return urlRegex.test(val);
      },
      { message: 'Please enter a valid URL' }
    ),
  termsAndConditions: z.boolean().refine(
    (val) => {
      if (val === false) return false;
      return true;
    },
    { message: 'Please accept the terms and conditions' }
  ),
});
