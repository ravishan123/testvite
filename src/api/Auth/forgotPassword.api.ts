import { Api } from '@utils/functions/apiEndpointFactory';
import { JSONBody } from '@utils/types';

const userPoolWebClientId = import.meta.env.VITE_USERPOOL_WEB_CLIENT_ID as string;

export async function forgotPasswordAPI(username: string) {
  if (Api.endpoints.forgotPassword) {
    const response = await fetch(Api.endpoints.forgotPassword.root as string, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        client_id: userPoolWebClientId,
      }),
    });
    const responseJson = (await response?.json()) as JSONBody;

    if (!response.ok) {
      throw responseJson || 'error updating user password';
    }

    return responseJson;
  }
}
