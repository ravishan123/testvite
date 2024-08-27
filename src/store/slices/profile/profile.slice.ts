import { createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import isEmpty from 'lodash-es/isEmpty';

import { Api } from '@utils/functions/apiEndpointFactory';
import { getCountryByCode } from '@utils/data/countries.data';
import { getAuthToken } from '@utils/functions/apiHeaders';
import { transformPreferenceResponse } from '@utils/functions/transformPreferenceResponse';
import { HomePageStats, UserProfileComplete } from '@utils/types/userProfile.type';
import { Preference } from '@utils/types/preference';

const baseUrl = Api.endpoints?.userProfile;
const baseHomePageUrl = Api.endpoints?.homeStats;

export enum ProfileTags {
  PROFILE = 'Profile',
  PROFILE_IMAGE = 'ProfileImage',
  PREFERENCE = 'Preference',
  HOME_STATS = 'HomeStats',
}

// export const profileApi = createApi({
//   reducerPath: 'profile',
//   refetchOnMountOrArgChange: true,
//   baseQuery: fetchBaseQuery({
//     baseUrl: baseUrl?.root,
//     prepareHeaders: async (headers: Headers) => {
//       const authToken = await getAuthToken();
//       headers.set('authorization', authToken);
//       return headers;
//     },
//   }),
//   tagTypes: [ProfileTags.PROFILE, ProfileTags.PROFILE_IMAGE, ProfileTags.PREFERENCE, ProfileTags.HOME_STATS],
//   endpoints: (builder) => ({
//     getProfile: builder.query<UserProfileComplete | null, void>({
//       query: () => '/',
//       providesTags: [ProfileTags.PROFILE],
//       transformResponse: (response: { data: UserProfileComplete }) =>
//         !isEmpty(response?.data)
//           ? {
//               ...response?.data,
//               countryName: getCountryByCode(response?.data?.country)?.name || response?.data?.country,
//             }
//           : null,
//     }),
//     getUserPreferences: builder.query<Preference, Partial<UserProfileComplete> | void>({
//       query: () => Api.getRelativePath('userProfile', Api.endpoints.preference?.root || ''),
//       providesTags: [ProfileTags.PREFERENCE],
//       serializeQueryArgs: () => {
//         return `getUserPreferences()`;
//       },
//       transformResponse: transformPreferenceResponse,
//     }),
//     getHomeStats: builder.query<any, void>({
//       query: () => Api.getRelativePath('homeStats', Api.endpoints.homeStats?.homeStats || ''),
//       providesTags: [ProfileTags.HOME_STATS],
//     }),
//   }),
// });

export const profileApi = createApi({
  reducerPath: 'profile',
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  tagTypes: [ProfileTags.PROFILE, ProfileTags.PROFILE_IMAGE, ProfileTags.PREFERENCE, ProfileTags.HOME_STATS],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfileComplete | null, void>({
      query: () => '/',
      providesTags: [ProfileTags.PROFILE],
      transformResponse: (response: { data: UserProfileComplete }) =>
        !isEmpty(response?.data)
          ? {
              ...response?.data,
              countryName: getCountryByCode(response?.data?.country)?.name || response?.data?.country,
            }
          : null,
    }),
    getUserPreferences: builder.query<Preference, Partial<UserProfileComplete> | void>({
      query: () => Api.getRelativePath('userProfile', Api.endpoints.preference?.root || ''),
      providesTags: [ProfileTags.PREFERENCE],
      serializeQueryArgs: () => {
        return `getUserPreferences()`;
      },
      transformResponse: transformPreferenceResponse,
    }),
  }),
});

export const homeStatsApi = createApi({
  reducerPath: 'homeStats',
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl: baseHomePageUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  tagTypes: [ProfileTags.HOME_STATS],
  endpoints: (builder) => ({
    getHomeStats: builder.query<HomePageStats, void>({
      query: () => '/',
      providesTags: [ProfileTags.HOME_STATS],
    }),
  }),
});

export const selectUserProfileResult = profileApi.endpoints.getProfile.select(undefined);
export const selectPreferenceSetupResult = profileApi.endpoints.getUserPreferences.select(undefined);
export const selectHomeStatsResult = homeStatsApi.endpoints.getHomeStats.select(undefined);

export const selectUserProfile = createSelector(selectUserProfileResult, (result) => result?.data);
export const selectUserPreference = createSelector(selectPreferenceSetupResult, (result) => result);
export const selectIsPreferenceSetupCompleted = createSelector(selectPreferenceSetupResult, (result) => {
  if (result?.data?.info) {
    const { info } = result.data;
    const { completedSteps, totalSteps } = info;
    return completedSteps === totalSteps;
  }

  return false;
});

export const { useLazyGetProfileQuery, useGetProfileQuery, useGetUserPreferencesQuery } = profileApi;

export const { useLazyGetHomeStatsQuery, useGetHomeStatsQuery } = homeStatsApi;
