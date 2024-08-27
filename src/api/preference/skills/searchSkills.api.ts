import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { SkillsApiResponse } from '@utils/types/preference/languages.type';

export async function searchSkillsApi(searchString: string) {
  if (Api.endpoints?.preference?.skillsSearch) {
    const response = await fetch(Api.endpoints.preference.skillsSearch, {
      method: 'POST',
      body: JSON.stringify({
        searchTerm: searchString,
        limit: '10',
      }),
      headers: await getHeaders(),
    });
    const responseJson = (await response?.json()) as SkillsApiResponse;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error searching for the skill');
    }

    return responseJson;
  }
}
