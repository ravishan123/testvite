import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '@utils/functions/apiEndpointFactory';
import { getAuthToken } from '@utils/functions/apiHeaders';
import { causesByName } from '@utils/constants/causes.const';
import unsdgs from '@utils/constants/unsdgs.const';

export interface Cause<TName, IId = string> {
  id: IId;
  name: TName;
}

export interface TransformedCause extends Cause<keyof typeof causesByName> {
  title: string;
}

export type OrgSizeItem = {
  id: string;
  category: string;
};

export type OrgSize = {
  data: OrgSizeItem[];
};

export type OrgSizeQueryType = {
  label: string;
  value: string;
};

export type OrganizationType = {
  id: string;
  orgtype: string;
  description: string;
};

export interface Unsdg<TId = string> {
  id: TId;
  label: string;
}

export interface UnsdgTransformed extends Unsdg {
  index: number;
  selected: boolean;
}

const baseUrl = Api.endpoints?.settings;

export const settingsApiSlice = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchCauses: builder.query<TransformedCause[], undefined>({
      query: () => Api.getRelativePath('settings', Api.endpoints.settings?.causes || ''),
      transformResponse: (response: { data: TransformedCause[] }) => {
        return response?.data?.map((cause) => ({
          ...cause,
          title: causesByName[cause.name]?.label || '',
        }));
      },
    }),
    fetchOrgSizes: builder.query<OrgSizeQueryType[], undefined>({
      query: () => Api.getRelativePath('settings', Api.endpoints.settings?.organizationSizes || ''),
      transformResponse: (response: OrgSize) => {
        return response.data.map((orgSize: OrgSizeItem) => ({
          label: orgSize.category,
          value: orgSize.id,
        }));
      },
    }),
    fetchOrgTypes: builder.query<OrganizationType[], undefined>({
      query: () => Api.getRelativePath('settings', Api.endpoints.settings?.organizationTypes || ''),
      transformResponse: (response: { data: OrganizationType[] }) => {
        return [
          ...(response?.data || []),
          {
            id: '0',
            orgtype: 'Other',
            description: '',
          },
        ];
      },
    }),
    fetchUnsdg: builder.query<UnsdgTransformed[], undefined>({
      query: () => Api.getRelativePath('settings', Api.endpoints.settings?.unsdgs || ''),
      transformResponse: (response: { data: Unsdg[] }) => {
        return response?.data?.map((unsdg: Unsdg) => ({
          ...unsdgs[unsdg.id],
          ...unsdg,
          selected: false,
        }));
      },
    }),
  }),
});

export const { useFetchCausesQuery, useFetchOrgSizesQuery, useFetchOrgTypesQuery, useFetchUnsdgQuery } =
  settingsApiSlice;
