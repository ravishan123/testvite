import { Auth } from 'aws-amplify';

const getHeaders = (): Promise<HeadersInit> =>
  Auth.currentSession().then((res) => ({
    Authorization: `Bearer ${res.getIdToken().getJwtToken()}`,
  }));

export const getAuthToken = (): Promise<string> =>
  Auth.currentSession().then((res) => `Bearer ${res.getIdToken().getJwtToken()}`);

export default getHeaders;
