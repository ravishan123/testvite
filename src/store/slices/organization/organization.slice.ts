import isEmpty from 'lodash-es/isEmpty';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCountryByCode } from '@utils/data/countries.data';
import { Api } from '@utils/functions/apiEndpointFactory';
import { getAuthToken } from '@utils/functions/apiHeaders';
import { getOrganizationLogo } from '@utils/functions/avatarUtils';
import {
  FetchPendingRequestsCountParams,
  HourVerificationApiResponse,
  HourVerificationRequest,
  HourVerificationRequestParams,
  Org,
  Organization,
  OrganizationResponse,
  PendingRequestsCountResponse,
  PendingRequestInfoResponse,
  VerificationStatsResponse,
  UpdateOrgRequestParams,
  ListAllOrgs,
  MyOrganizations,
  JoinGroup,
  LeaveGroup,
} from '@utils/types/organization.type';
import { formatDate } from '@utils/functions/formatDate';

const baseUrl = Api.endpoints?.organization;

export enum organizationTags {
  ORGANIZATION = 'Organization',
  FETCH_VERIFICATION_STATS = 'fetch_verification_stats',
}

export const organizationApiSlice = createApi({
  reducerPath: 'organizationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  tagTypes: [organizationTags.ORGANIZATION, organizationTags.FETCH_VERIFICATION_STATS],
  endpoints: (builder) => ({
    fetchOrgList: builder.query<Org[], string | void>({
      query: (searchTerm) =>
        `${Api.getRelativePath('organization', Api.endpoints.organization?.search || '')}?searchTerm=${
          searchTerm || ''
        }`,
      serializeQueryArgs: () => {
        return `fetchOrgList()`;
      },
      transformResponse: (response: { data: Org[] }) =>
        response?.data?.map((result) => ({
          ...result,
          value: result.name,
          logo: getOrganizationLogo(result.logo),
        })),
    }),

    getOrganizations: builder.query<Partial<MyOrganizations>, string | void>({
      query: () => {
        const path = Api.getRelativePath('organization', Api.endpoints.organization?.myOrgs || '');
        return {
          url: path,
          params: {
            context: 'web',
          },
        };
      },
      transformResponse: (response: { data: Organization[] }) =>
        !isEmpty(response?.data)
          ? response.data?.map((orgs) => {
              return {
                ...orgs,
                logo: getOrganizationLogo(orgs.logo),
                country: getCountryByCode(orgs.country)?.name || orgs.country,
              };
            })
          : {},
      providesTags: [organizationTags.ORGANIZATION],
    }),
    getOtherOrganizations: builder.query<Partial<Organization>, { orgId: string; contextType: string }>({
      query: ({ orgId, contextType }) => {
        const path = `/${Api.getRelativePath('organization', Api.endpoints.organization?.organization || '')}`;
        return {
          url: path,
          params: {
            context: contextType,
            orgId: orgId,
          },
        };
      },
      transformResponse: (response: { data: Organization }) =>
        !isEmpty(response?.data)
          ? {
              ...response?.data,
              logo: getOrganizationLogo(response?.data?.logo),
              country: getCountryByCode(response?.data?.country)?.name || response?.data?.country,
            }
          : {},

      providesTags: [organizationTags.ORGANIZATION],
    }),
    getOrganizationsEdit: builder.query<Partial<Organization>, { orgId: string; contextType: string }>({
      query: ({ orgId, contextType }) => {
        const path = Api.getRelativePath('organization', Api.endpoints.organization?.organization || '');

        return {
          url: path,
          ...(!!contextType && {
            params: {
              orgId: orgId,
              context: contextType,
            },
          }),
        };
      },
      transformResponse: (response: { data: Organization }) =>
        !isEmpty(response?.data)
          ? {
              ...response?.data,
            }
          : {},
      providesTags: [organizationTags.ORGANIZATION],
    }),
    createOrganization: builder.mutation<OrganizationResponse, unknown>({
      query: (payload) => ({
        url: Api.getRelativePath('organization', Api.endpoints.organization?.organization || ''),
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [organizationTags.ORGANIZATION],
    }),
    joinGroup: builder.mutation<JoinGroup, unknown>({
      query: (payload) => ({
        url: Api.getRelativePath('organization', Api.endpoints.organization?.joinGroup || ''),
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [organizationTags.ORGANIZATION],
    }),
    leaveGroup: builder.mutation<LeaveGroup, unknown>({
      query: (payload) => ({
        url: Api.getRelativePath('organization', Api.endpoints.organization?.leaveGroup || ''),
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [organizationTags.ORGANIZATION],
    }),
    updateOrganization: builder.mutation<OrganizationResponse, UpdateOrgRequestParams>({
      query: ({ payload, id }) => ({
        url: Api.getRelativePath('organization', Api.endpoints.organization?.organization || ''),
        method: 'PATCH',
        body: payload,
        headers: { orgid: id },
      }),
      invalidatesTags: [organizationTags.ORGANIZATION],
    }),

    fetchVerificationStats: builder.query<VerificationStatsResponse, string>({
      query: (id) => {
        const path = Api.getRelativePath('organization', Api.endpoints.organization?.verificationStats || '');
        return {
          url: path,
          headers: { orgid: id },
        };
      },
      transformResponse: (response: {
        data: {
          numOfRequestsVerified: string;
          numOfPendingVerifications: string;
          numOfDeclinedVerifications: string;
          verifiedHours: {
            hours: number;
            minutes: number;
          };
        };
      }) => {
        return response?.data;
      },
      providesTags: [organizationTags.FETCH_VERIFICATION_STATS],
      keepUnusedDataFor: 0,
    }),
    fetchVerificationRequests: builder.query<HourVerificationRequest, HourVerificationRequestParams>({
      query: ({ pageNumber, pageSize, sortByDirection, status, name, id }) => {
        const path = Api.getRelativePath('organization', Api.endpoints.organization?.verificationRequest || '');
        return {
          url: path,
          params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortByDirection: sortByDirection,
            status: status,
            name: name,
          },
          headers: { orgid: id },
        };
      },
      transformResponse: (response: HourVerificationApiResponse) => {
        return {
          data: response?.data?.map((item) => ({
            id: item?.id,
            senderId: item.request_sender_user_id,
            requestBy: item?.name,
            hoursReceived: `${item?.volunteer_hour?.hours || 0}h ${item?.volunteer_hour?.minutes || 0}m`,
            dateActivity: `${formatDate(item?.start_date)} ${item?.end_date && `- ${formatDate(item?.end_date)}`}`,
            location: item.isRemote ? 'Remote' : item?.location || '',
            status: item?.status,
          })),
          numberOfItems: response?.numberOfItems,
          pageNumber: response?.pageNumber,
        };
      },
    }),
    fetchPendingRequestsCount: builder.query<PendingRequestsCountResponse, FetchPendingRequestsCountParams>({
      query: () => {
        const path = Api.getRelativePath('organization', Api.endpoints.organization?.pendingRequestsCount || '');
        return {
          url: path,
        };
      },
      transformResponse: (response: PendingRequestsCountResponse) => {
        return {
          numberOfRequests: response?.numberOfRequests,
        };
      },
    }),
    fetchPendingRequestV2: builder.query<PendingRequestInfoResponse, FetchPendingRequestsCountParams>({
      query: () => {
        const path = Api.getRelativePath('organization', Api.endpoints.organization?.pendingRequestsV2 || '');
        return {
          url: path,
        };
      },
      transformResponse: (response: PendingRequestInfoResponse) => {
        return response;
      },
    }),
    listAllOrganization: builder.query<
      ListAllOrgs,
      {
        pageSize?: number;
        pageNumber?: number;
        sortByFilter?: string;
        searchTerm?: string;
        causeId?: string;
      }
    >({
      query: ({ pageSize = 10, pageNumber = 1, sortByFilter, searchTerm, causeId }) => {
        const queryParams = new URLSearchParams({
          pageSize: pageSize.toString(),
          pageNumber: pageNumber.toString(),
          sortByFilter: sortByFilter || 'sc',
        });

        if (searchTerm && searchTerm.trim() !== '') {
          queryParams.append('searchTerm', searchTerm.trim());
        }

        if (causeId && causeId.trim() !== 'Show All') {
          queryParams.append('causeId', causeId.trim());
        }

        const path = `${Api.getRelativePath(
          'organization',
          Api.endpoints.organization?.listAllOrganization || ''
        )}?${queryParams.toString()}`;
        return { url: path };
      },

      transformResponse: (response: ListAllOrgs) => {
        const { data, ...rest } = response;
        const orgDetails = data.map((org) => {
          const { total_hours, ...restOrg } = org;
          let hours: string | number = Number(total_hours);
          if (isNaN(hours)) {
            hours = 0;
          }
          hours = Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
          hours = hours >= 1000 ? `${(hours / 1000).toFixed(1)}k` : hours;
          return {
            ...restOrg,
            total_hours: hours || 0,
          };
        });

        return (
          {
            data: orgDetails,
            ...rest,
          } || []
        );
      },
    }),
    listJoinedGroups: builder.query<
      ListAllOrgs,
      {
        pageSize?: number;
        pageNumber?: number;
        sortByFilter?: string;
        searchTerm?: string;
        causeId?: string;
      }
    >({
      query: ({ pageSize = 10, pageNumber = 1, sortByFilter, searchTerm, causeId }) => {
        const queryParams = new URLSearchParams({
          pageSize: pageSize.toString(),
          pageNumber: pageNumber.toString(),
          sortByFilter: sortByFilter || 'sc',
        });

        if (searchTerm && searchTerm.trim() !== '') {
          queryParams.append('searchTerm', searchTerm.trim());
        }

        if (causeId && causeId.trim() !== 'Show All') {
          queryParams.append('causeId', causeId.trim());
        }

        const path = `${Api.getRelativePath(
          'organization',
          Api.endpoints.organization?.listJoinedGroups || ''
        )}?${queryParams.toString()}`;
        return { url: path };
      },

      transformResponse: (response: ListAllOrgs) => {
        const { data, ...rest } = response;
        const orgDetails = data.map((org) => {
          const { total_hours, ...restOrg } = org;
          let hours: string | number = Number(total_hours);
          if (isNaN(hours)) {
            hours = 0;
          }
          hours = Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
          hours = hours >= 1000 ? `${(hours / 1000).toFixed(1)}k` : hours;
          return {
            ...restOrg,
            total_hours: hours || 0,
          };
        });

        return (
          {
            data: orgDetails,
            ...rest,
          } || []
        );
      },
    }),
  }),
});

export const selectFetchOrgResult = organizationApiSlice.endpoints.fetchOrgList.select(undefined);

export const {
  useFetchOrgListQuery,
  useCreateOrganizationMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetOrganizationsQuery,
  useGetOtherOrganizationsQuery,
  useGetOrganizationsEditQuery,
  useFetchVerificationStatsQuery,
  useUpdateOrganizationMutation,
  useFetchVerificationRequestsQuery,
  useListAllOrganizationQuery,
  useListJoinedGroupsQuery,
  useFetchPendingRequestsCountQuery,
  useFetchPendingRequestV2Query,
} = organizationApiSlice;
