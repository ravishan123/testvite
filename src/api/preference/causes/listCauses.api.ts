import { Api } from '@utils/functions/apiEndpointFactory';
import getHeaders from '@utils/functions/apiHeaders';

interface ListCause {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
}
interface ListCauseResponseAPI {
  data: ListCause[];
  message?: string;
}

export async function listCausesApi() {
  if (Api.endpoints?.preference?.causes) {
    const response = await fetch(Api.endpoints.preference.causes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(await getHeaders()),
      },
    });
    const responseJson = (await response?.json()) as ListCauseResponseAPI;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error getting gudppl causes');
    }

    return responseJson;
  }
}
