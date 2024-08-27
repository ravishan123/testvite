import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCountryByCode } from '@utils/data/countries.data';
import { Api } from '@utils/functions/apiEndpointFactory';
import { getAuthToken } from '@utils/functions/apiHeaders';
import { Activity, ActivityData } from '@utils/types/activity.type';
import { AddHoursPayload, VerifyActivityPayload } from '@utils/types/volunteer.type';
import { organizationTags } from '../organization/organization.slice';

// import { organizationApiSlice, organizationTags } from '../organization/organization.slice';

const baseUrl = Api.endpoints?.volunteer;

export enum volunteerTags {
  ADD_HOURS = 'volunteer-request',
  FETCH_HOUR = 'fetch_hour',
  FETCH_STATS = 'fetch_stats',
  FETCH_VOLUNTEER_ACTIVITIES = 'fetch_volunteer_activities',
}

interface NewArgs {
  page?: number;
  limit?: number;
  status?: string;
}

export const volunteerApiSlice = createApi({
  reducerPath: 'volunteerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  tagTypes: [
    volunteerTags.ADD_HOURS,
    volunteerTags.FETCH_HOUR,
    volunteerTags.FETCH_STATS,
    volunteerTags.FETCH_VOLUNTEER_ACTIVITIES,
    organizationTags.FETCH_VERIFICATION_STATS,
  ],
  endpoints: (builder) => ({
    AddHourRequest: builder.mutation<AddHoursPayload, AddHoursPayload>({
      query: (payload) => ({
        url: Api.getRelativePath('volunteer', Api.endpoints.volunteer?.verificationRequest || ''),
        method: 'POST',
        body: payload,
      }),
      transformErrorResponse: (response) => {
        return response?.data;
      },
    }),
    fetchVolunteerActivities: builder.query<Activity[], { page: number; limit: number; status?: string }>({
      query: ({ page, limit, status }) => {
        const path = Api.getRelativePath('volunteer', Api.endpoints.volunteer?.hours || '');
        return {
          url: path,
          params: { page, limit, ...(status && { status }) },
        };
      },
      transformResponse: (response: { data: Activity[] }) => {
        return response?.data?.map((activities: Activity) => ({
          ...activities,
          date: new Date(activities.date).toLocaleDateString(),
        }));
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const newArgs: NewArgs = { ...queryArgs };
        if (newArgs.page) delete newArgs.page;
        return newArgs;
      },
      merge: (activities, newActivities) => {
        return [...(activities || []), ...(newActivities || [])];
      },
      forceRefetch(params) {
        return params.currentArg !== params.previousArg;
      },
      keepUnusedDataFor: 0, // TODO: this is a hack to clear cached data. Need to find a proper solution
      providesTags: [volunteerTags.FETCH_VOLUNTEER_ACTIVITIES],
    }),
    fetchVolunteerStat: builder.query({
      query: () => {
        const path = Api.getRelativePath('volunteer', Api.endpoints.volunteer?.stats || '');
        return {
          url: path,
        };
      },
      transformResponse: (response: { data: [{ hoursGiven: string; activities: string }] }) => {
        return response?.data;
      },
      providesTags: [volunteerTags.FETCH_STATS],
    }),
    fetchVolunteerActivity: builder.query<ActivityData, string>({
      query: (id) => {
        const path = Api.getRelativePath('volunteer', Api.endpoints.volunteer?.view || '');
        return {
          url: path,
          params: { hourId: id },
        };
      },
      transformResponse: (response: { data: ActivityData }) => {
        return {
          ...response?.data,
          activityLocation: {
            ...response?.data?.activityLocation,
            country: getCountryByCode(response?.data?.activityLocation?.country)?.name || '',
          },
        };
      },
      providesTags: [volunteerTags.FETCH_HOUR],
    }),
    verifyHourRequest: builder.mutation<VerifyActivityPayload, VerifyActivityPayload>({
      query: ({ orgId, ...payload }) => ({
        url: Api.getRelativePath('volunteer', Api.endpoints.volunteer?.approval || ''),
        method: 'POST',
        body: payload,
        headers: {
          'x-org-id': orgId,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data;
      },
      // TODO: this is the ideal way to invalidate an endpoint in another slice. Currently we are using a refetch in RequestNotificationBanner. We need to test and remove it in a tech debt ticket.
      // onQueryStarted(arg, api) {
      //   void api.queryFulfilled.then(() => {
      //     void api.dispatch(organizationApiSlice.util.invalidateTags([organizationTags.FETCH_VERIFICATION_STATS]));
      //   });
      // },
      invalidatesTags: [volunteerTags.FETCH_HOUR, volunteerTags.FETCH_STATS, organizationTags.FETCH_VERIFICATION_STATS],
    }),
  }),
});

export const {
  useAddHourRequestMutation,
  useFetchVolunteerActivitiesQuery,
  useFetchVolunteerStatQuery,
  useFetchVolunteerActivityQuery,
  useVerifyHourRequestMutation,
} = volunteerApiSlice;
