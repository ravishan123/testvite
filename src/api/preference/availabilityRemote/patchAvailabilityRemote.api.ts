import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { JSONBody } from '@utils/types';

export async function patchAvailabilityRemoteApi(payload: boolean) {
  if (Api.endpoints?.preference?.availability) {
    const response = await fetch(`${Api.endpoints.preference.availability}/remote`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ availability: payload ? true : 'false' }),
    });
    const responseJson = (await response?.json()) as JSONBody;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error updating user remote availability');
    }

    return responseJson;
  }
}
