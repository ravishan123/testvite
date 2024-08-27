import getHeaders from '@utils/functions/apiHeaders';
import { Api } from '@utils/functions/apiEndpointFactory';
import { GetAvailabilityRemoteAPIResponse } from '@utils/types/preference/availability.type';

export async function getAvailabilityRemoteApi() {
  if (Api.endpoints?.preference?.availability) {
    const response = await fetch(`${Api.endpoints.preference.availability}/remote`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    const responseJson = (await response?.json()) as GetAvailabilityRemoteAPIResponse;

    if (!response.ok) {
      throw new Error((responseJson?.message as string) || 'error getting user remote availability');
    }

    return responseJson;
  }
}
