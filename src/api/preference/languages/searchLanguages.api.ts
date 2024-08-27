import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { LanguageResponse } from '@utils/types/preference/languages.type';

export async function searchLanguagesApi(searchString: string) {
  if (Api.endpoints?.preference?.languagesSearch) {
    const response = await fetch(Api.endpoints.preference.languagesSearch, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({
        searchTerm: searchString,
        limit: '10',
      }),
    });
    const responseJson = (await response?.json()) as LanguageResponse;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error searching for the language');
    }

    return responseJson;
  }
}
