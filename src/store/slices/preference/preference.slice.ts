import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Api } from '@utils/functions/apiEndpointFactory';
import { getAuthToken } from '@utils/functions/apiHeaders';
import { Skill } from '@utils/types/preference/languages.type';
import { SkillsResponse } from '@utils/types/preference/skills.type';

const baseUrl = Api.endpoints?.preference;

export enum preferenceTags {
  SEARCH_SKILLS = 'search-skills',
}

export const preferenceApiSlice = createApi({
  reducerPath: 'preferenceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl?.root,
    prepareHeaders: async (headers: Headers) => {
      const authToken = await getAuthToken();
      headers.set('authorization', authToken);
      return headers;
    },
  }),
  tagTypes: [preferenceTags.SEARCH_SKILLS],
  endpoints: (builder) => ({
    searchSkills: builder.query<Skill[], string>({
      query: (payload) => ({
        url: Api.getRelativePath('preference', Api.endpoints.preference?.skillsSearch || ''),
        method: 'POST',
        body: {
          searchTerm: payload,
          limit: 10,
        },
      }),
      transformResponse: (response: SkillsResponse) =>
        response.data.map((result) => ({
          ...result,
          default_skill: true,
        })),
    }),
  }),
});

export const { useSearchSkillsQuery } = preferenceApiSlice;
