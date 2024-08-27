import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { JSONBody } from '@utils/types';
import { LanguagePayload } from '@utils/types/preference/languages.type';

export async function patchLanguagesApi(payload: LanguagePayload[]) {
  if (Api.endpoints?.preference?.language) {
    const response = await fetch(Api.endpoints.preference.language, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ languages: payload }),
    });
    const responseJson = (await response?.json()) as JSONBody;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error updating user languages');
    }

    return responseJson;
  }
}
