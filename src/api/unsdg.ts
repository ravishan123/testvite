import { Api } from '@utils/functions/apiEndpointFactory';
import getHeaders from '@utils/functions/apiHeaders';
import { UserUNSDG } from '@utils/types/preference/unsdg.type';

export const getUserUNSDG = async () => {
  if (Api.endpoints?.preference?.unsdg) {
    return fetch(Api.endpoints.preference.unsdg, {
      method: 'GET',
      headers: await getHeaders(),
    });
  }
};

export const assignUserUNSDG = async (data: UserUNSDG) => {
  if (Api.endpoints?.preference?.unsdg) {
    return fetch(Api.endpoints.preference.unsdg, {
      method: 'POST',
      body: JSON.stringify({ sdgs: data }),
      headers: await getHeaders(),
    });
  }
};

export const updateUserUNSDG = async (data: UserUNSDG) => {
  if (Api.endpoints?.preference?.unsdg) {
    return await fetch(Api.endpoints.preference.unsdg, {
      method: 'PATCH',
      body: JSON.stringify({ sdgs: data }),
      headers: await getHeaders(),
    });
  }
};
