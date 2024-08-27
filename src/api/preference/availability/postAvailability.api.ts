import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { JSONBody } from '@utils/types';
import { AvailabilityPayload } from '@utils/types/preference/availability.type';

export async function postAvailabilityApi(payload: AvailabilityPayload) {
  if (Api.endpoints?.preference?.availability) {
    const response = await fetch(Api.endpoints.preference.availability, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ availability: payload }),
    });
    const responseJson = (await response?.json()) as JSONBody;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error updating user availability');
    }

    return responseJson;
  }
}
