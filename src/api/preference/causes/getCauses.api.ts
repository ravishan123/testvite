import { Api } from '@utils/functions/apiEndpointFactory';
import getHeaders from '@utils/functions/apiHeaders';

interface Cause {
  id: string;
}

export interface GetCauseResponseAPI {
  data: Cause[];
  message?: string;
}

export async function getCausesApi() {
  if (Api.endpoints?.preference?.causes) {
    const response = await fetch(Api.endpoints.preference.causes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(await getHeaders()),
      },
    });
    const responseJson = (await response?.json()) as GetCauseResponseAPI;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error getting user causes');
    }

    return responseJson;
  }
}
