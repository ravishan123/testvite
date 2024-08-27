import { Api } from '@utils/functions/apiEndpointFactory';
import getHeaders from '@utils/functions/apiHeaders';
import { JSONBody } from '@utils/types';

export async function postCausesApi(causesList: string[]) {
  if (Api.endpoints?.preference?.causes) {
    const response = await fetch(Api.endpoints.preference.causes, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getHeaders()),
      },
      body: JSON.stringify({
        causes: causesList,
      }),
    });
    const responseJson = (await response?.json()) as JSONBody;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error updating user causes');
    }

    return responseJson;
  }
}
