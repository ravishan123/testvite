import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { LanguageResponse } from '@utils/types/preference/languages.type';

export async function getLanguagesApi() {
  if (Api.endpoints?.preference?.language) {
    const response = await fetch(Api.endpoints.preference.language, {
      method: 'GET',
      headers: await getHeaders(),
    });
    const responseJson = (await response?.json()) as LanguageResponse;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error getting languages');
    }

    return responseJson;
  }
}
