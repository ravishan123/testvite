import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { SkillResponse } from '@utils/types/preference/languages.type';

export async function getSkillsApi() {
  if (Api.endpoints?.preference?.skill) {
    const response = await fetch(Api.endpoints.preference.skill, {
      method: 'GET',
      headers: await getHeaders(),
    });
    const responseJson = (await response?.json()) as SkillResponse;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error getting skills');
    }

    return responseJson;
  }
}
