import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '@utils/functions/apiEndpointFactory';
import { getAuthToken } from '@utils/functions/apiHeaders';
import { format } from 'date-fns';
import { isEmpty } from 'lodash-es';
import {
  ListSupporters,
  ListSupportersParams,
  ListAdminSupporters,
  MutationResponseAdminSupporters,
  MutationCommonResponse,
  ListManageAdminSupporters,
  ListManageSupportersParams,
  ListManageAdmins,
  ListManageAdminParams,
  ManageEditRoleResponse,
  ManageEditRoleRequestBody,
  GetUserRole,
  GetUserRoleParams,
} from '@utils/types/organization.type';

const baseUrl = Api.endpoints.supporter;

export enum supportersTags {
  FETCH_SUPPORTERS = 'supporters-request',
}

export const supporterApiSlice = createApi({
  reducerPath: 'supporterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  tagTypes: [supportersTags.FETCH_SUPPORTERS],

  endpoints: (builder) => ({
    getPublicSupporters: builder.query<ListSupporters, ListSupportersParams>({
      query: ({ orgId, pageSize, page, totalCount }) => {
        const path = Api.getRelativePath('supporter', Api.endpoints.supporter?.public || '');
        const queryParams = new URLSearchParams({
          orgId,
          pageSize: pageSize.toString(),
          page: page.toString(),
        });
        if (totalCount === '') {
          return `${path}?${queryParams.toString()}&totalCount=null`;
        } else {
          return `${path}?${queryParams.toString()}&totalCount=${totalCount}`;
        }
      },
      transformResponse: (response: { supporters: [{ id: string; supporter: string }]; totalCount: number }) => {
        return response;
      },
    }),
    fetchAdminSupporters: builder.query<
      MutationResponseAdminSupporters,
      {
        orgId: string;
        filter: string;
        totalCount: string;
        page: number;
        pageSize: number;
        sort: string;
        search?: string;
      }
    >({
      query: ({ orgId, page, pageSize, filter = 'all', sort = 'rj', totalCount = null, search = null }) => {
        const queryParams = new URLSearchParams({
          pageSize: pageSize.toString(),
          orgId,
          page: page.toString(),
          sort,
          filter,
          totalCount: totalCount || 'null',
        });

        if (search && search.trim() !== '') {
          queryParams.append('search', search.trim());
        }

        const path = `${Api.getRelativePath(
          'supporter',
          Api.endpoints.supporter?.admin || ''
        )}?${queryParams.toString()}`;
        return { url: path };
      },

      transformResponse: (response: ListAdminSupporters) => {
        return {
          totalCount: response.totalCount,
          supporters: response.supporters.map((supporter) => {
            let groups_joined: string[] = [];
            if (supporter.is_donor) {
              groups_joined = ['Donor'];
            }
            if (supporter.is_volunteer) {
              groups_joined = [...groups_joined, 'Volunteer'];
            }
            let hours = supporter?.volunteerInfo?.hours ?? '';
            const splitHours = hours.split(' ');
            if (splitHours[0] === '0h') {
              hours = splitHours[1];
            }

            if (splitHours[1] === '0m') {
              hours = splitHours[0];
            }

            return {
              id: supporter.user_id,
              name: supporter.name,
              role: supporter.role,
              join_at: format(new Date(supporter.join_at), 'dd/MM/yyyy'),
              email: supporter.email,
              phone: supporter.phone,
              isDonor: supporter.is_donor,
              isVolunteer: supporter.is_volunteer,
              is_disable_remove: supporter.is_disable_remove,
              groups_joined,
              org_id: supporter.org_id,
              hours: !isEmpty(hours) ? hours : '-',
              numOfPendingVerifications: supporter.volunteerInfo.numOfPendingVerifications,
              recent_supported: supporter?.volunteerInfo?.recent_supported
                ? format(new Date(supporter?.volunteerInfo?.recent_supported), 'dd/MM/yyyy')
                : '-',
            };
          }),
        };
      },
    }),
    editGroupAdmin: builder.mutation<
      MutationCommonResponse,
      {
        organizationId: string;
        targetUserId: string;
        isDonor: boolean;
        isVolunteer: boolean;
      }
    >({
      query: (payload) => ({
        url: Api.getRelativePath('supporter', Api.endpoints.supporter?.admin || ''),
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [supportersTags.FETCH_SUPPORTERS],
    }),
    exitGroupAdmin: builder.mutation<MutationCommonResponse, { organizationId: string; targetUserId: string }>({
      query: (payload) => ({
        url: `${Api.getRelativePath('supporter', Api.endpoints.supporter?.admin || '')}?${new URLSearchParams({
          ...payload,
        }).toString()}`,
        method: 'DELETE',
      }),
      invalidatesTags: [supportersTags.FETCH_SUPPORTERS],
    }),

    listManageSupporters: builder.query<ListManageAdminSupporters, ListManageSupportersParams>({
      query: ({ orgId, pageSize, page, totalCount }) => {
        const path = Api.getRelativePath('supporter', Api.endpoints.supporter?.listSupporters || '');
        const queryParams = new URLSearchParams({
          orgId,
          pageSize: pageSize.toString(),
          page: page.toString(),
        });
        if (totalCount === '') {
          return `${path}?${queryParams.toString()}&totalCount=null`;
        } else {
          return `${path}?${queryParams.toString()}&totalCount=${totalCount}`;
        }
      },
      transformResponse: (response: ListManageAdminSupporters) => {
        return response;
      },
    }),

    listManageAdmins: builder.query<ListManageAdmins, ListManageAdminParams>({
      query: ({ orgId }) => {
        const path = Api.getRelativePath('supporter', Api.endpoints.supporter?.lisAdmins || '');
        const queryParams = new URLSearchParams({
          orgId,
        });

        return `${path}?${queryParams.toString()}`;
      },
      transformResponse: (response: ListManageAdmins) => {
        return response;
      },
    }),
    getUserRole: builder.query<GetUserRole, GetUserRoleParams>({
      query: ({ orgId }) => {
        const queryParams = new URLSearchParams({
          orgId,
        });

        return `?${queryParams.toString()}`;
      },
      transformResponse: (response: GetUserRole) => {
        return response;
      },
    }),

    manageEditRole: builder.mutation<ManageEditRoleResponse, ManageEditRoleRequestBody>({
      query: (body) => ({
        url: `${Api.getRelativePath('supporter', Api.endpoints.supporter?.editRole || '')}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: ManageEditRoleResponse) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetPublicSupportersQuery,
  useFetchAdminSupportersQuery,
  useEditGroupAdminMutation,
  useExitGroupAdminMutation,
  useListManageSupportersQuery,
  useListManageAdminsQuery,
  useManageEditRoleMutation,
  useGetUserRoleQuery,
} = supporterApiSlice;
