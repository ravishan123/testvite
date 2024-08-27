import { Api } from '@utils/functions/apiEndpointFactory';
import getHeaders from '@utils/functions/apiHeaders';
import { JSONBody } from '@utils/types';
import { Skill, SkillWithoutId } from '@utils/types/preference/languages.type';

export async function patchSkillsApi(payload: Skill[] | SkillWithoutId) {
  if (Api.endpoints?.preference?.skill) {
    const response = await fetch(Api.endpoints.preference.skill, {
      method: 'PATCH',
      body: JSON.stringify({ skill: payload }),
      headers: await getHeaders(),
    });
    const responseJson = (await response?.json()) as JSONBody;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error updating user skills');
    }

    return responseJson;
  }
}
