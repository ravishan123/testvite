import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { GetAvailabilityAPIResponse } from '@utils/types/preference/availability.type';

export async function getAvailabilityApi() {
  if (Api.endpoints?.preference?.availability) {
    const response = await fetch(Api.endpoints.preference.availability, {
      method: 'GET',
      headers: await getHeaders(),
    });
    const responseJson = (await response?.json()) as GetAvailabilityAPIResponse;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error getting user availability');
    }

    return responseJson;
  }
}
